// src/pages/api/holidays.json.ts
import type { APIRoute } from "astro";

// Nager v3: https://date.nager.at/swagger/index.html
type NagerHoliday = {
  date: string; // "YYYY-MM-DD"
  localName: string;
  name: string;
  countryCode: string; // "AR"
  fixed: boolean;
  global: boolean;
  counties?: string[] | null;
  launchYear?: number | null;
  // En algunos despliegues aparece 'types' (array), en otros sólo es "PublicHolidays"
  types?: string[];
};

type NormalizedHoliday = {
  name: string;
  dateISO: string;
  dateLabel: string;
  types: string[];
  description?: string;
  isTourismExtra?: boolean; // "puente" / "turístico" (heurística por nombre)
};

function pickLocale(cands: Array<string | undefined>) {
  for (const lc of cands) {
    try {
      new Intl.DateTimeFormat(lc);
      return lc;
    } catch {}
  }
  return undefined;
}

// En Nager este endpoint ya es de “PublicHolidays”
// Igual dejamos esta función por si en algún país vienen 'types'
function isNational(h: NagerHoliday) {
  if (Array.isArray(h.types)) return h.types.some((t) => /public/i.test(t));
  return true; // por definición de endpoint
}

function isTourismLike(h: NagerHoliday, country: string) {
  // Heurística por nombre para detectar “puentes/turísticos”
  const text = `${h.localName} ${h.name}`.toLowerCase();
  const kw = [
    "puente",
    "turismo",
    "turística",
    "turísticos",
    "turisticos",
    "bridge",
    "long weekend",
    "extra holiday",
  ];
  return kw.some((k) => text.includes(k));
}

function normalize(
  raw: NagerHoliday[],
  locale = "es-AR",
  country = "AR",
  mode: "national" | "national_plus" = "national_plus"
): NormalizedHoliday[] {
  const loc = pickLocale([locale, "es-AR", "es-ES", "es", "en-US", undefined]);

  const filtered = raw.filter((h) =>
    mode === "national_plus"
      ? isNational(h) || isTourismLike(h, country)
      : isNational(h)
  );

  return filtered
    .map((h) => {
      let label = h.date;
      try {
        label = new Date(h.date).toLocaleDateString(loc, {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      } catch {}
      const national = isNational(h);
      const isTour = isTourismLike(h, country);
      const types = Array.isArray(h.types)
        ? h.types
        : national
        ? ["Public"]
        : ["Observance"];
      return {
        name: h.localName || h.name,
        dateISO: h.date,
        dateLabel: label,
        types,
        description: "",
        isTourismExtra: !national && isTour,
      };
    })
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const country = (url.searchParams.get("country") ?? "AR").toUpperCase();
  const year = url.searchParams.get("year") ?? "2025";
  const locale = url.searchParams.get("locale") ?? "es-AR";
  const mode = (
    url.searchParams.get("mode") ?? "national_plus"
  ).toLowerCase() as "national" | "national_plus";

  // Nager no necesita API key
  const endpoint = `https://date.nager.at/api/v3/PublicHolidays/${encodeURIComponent(
    year
  )}/${encodeURIComponent(country)}`;

  try {
    const resp = await fetch(endpoint, { cache: "no-store" });
    if (!resp.ok) {
      const body = {
        mode: "error",
        error: `Nager Date HTTP ${resp.status}`,
        country,
        year,
      };
      return new Response(JSON.stringify(body), {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    const raw: NagerHoliday[] = await resp.json();
    const holidays = normalize(raw, locale, country, mode);
    return new Response(
      JSON.stringify({
        mode: "live",
        source: "nager",
        country,
        year,
        filterMode: mode,
        total: holidays.length,
        holidays,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    const body = { mode: "error", error: String(e), country, year };
    return new Response(JSON.stringify(body), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
