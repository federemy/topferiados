// src/pages/api/ranking.json.ts
import type { APIRoute } from "astro";

type CountItem = { country: string; total: number; error?: string };

const CACHE = new Map<string, { ts: number; total: number }>();
const TTL_MS = 6 * 60 * 60 * 1000; // 6h

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const countriesParam = url.searchParams.get("countries") ?? "";
  const year = url.searchParams.get("year") ?? "2025";
  const locale = url.searchParams.get("locale") ?? "es-AR";
  const mode = (url.searchParams.get("mode") ?? "national_plus").toLowerCase();
  const limit = Math.max(
    1,
    Math.min(50, Number(url.searchParams.get("limit") ?? 10))
  );
  const include = (url.searchParams.get("include") ?? "").toUpperCase();

  const allCodes = countriesParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  const base = `${url.origin}/api/holidays.json?year=${encodeURIComponent(
    year
  )}&locale=${encodeURIComponent(locale)}&mode=${encodeURIComponent(mode)}`;

  async function getCount(country: string): Promise<CountItem> {
    const key = `${country}|${year}|${mode}|nager`;
    const now = Date.now();
    const hit = CACHE.get(key);
    if (hit && now - hit.ts < TTL_MS) return { country, total: hit.total };

    try {
      const r = await fetch(`${base}&country=${country}`, {
        cache: "no-store",
      });
      if (!r.ok) return { country, total: 0, error: `HTTP ${r.status}` };
      const data = await r.json();
      if (data?.mode !== "live")
        return { country, total: 0, error: String(data?.error || "not live") };
      const total = Number(data?.total ?? 0);
      CACHE.set(key, { ts: now, total });
      return { country, total };
    } catch (e: any) {
      return { country, total: 0, error: String(e) };
    }
  }

  // concurrencia limitada
  const CONC = 12;
  const results: CountItem[] = [];
  for (let i = 0; i < allCodes.length; i += CONC) {
    const chunk = allCodes.slice(i, i + CONC);
    const got = await Promise.all(chunk.map(getCount));
    results.push(...got);
  }

  results.sort(
    (a, b) => b.total - a.total || a.country.localeCompare(b.country)
  );

  // top N + include
  let view = results.slice(0, limit);
  if (include) {
    const me = results.find((r) => r.country === include);
    if (me && !view.some((v) => v.country === include)) view.push(me);
  }
  view.sort((a, b) => b.total - a.total || a.country.localeCompare(b.country));

  return new Response(JSON.stringify({ year, mode, results: view }), {
    headers: { "Content-Type": "application/json" },
  });
};
