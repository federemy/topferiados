// src/pages/api/countries_supported.json.ts
import type { APIRoute } from "astro";

// https://date.nager.at/api/v3/AvailableCountries
type NagerCountry = { countryCode: string; name: string };

const TTL_MS = 24 * 60 * 60 * 1000;
let cache: { ts: number; codes: string[] } | null = null;

export const GET: APIRoute = async () => {
  if (cache && Date.now() - cache.ts < TTL_MS) {
    return new Response(JSON.stringify({ mode: "cache", codes: cache.codes }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const r = await fetch("https://date.nager.at/api/v3/AvailableCountries", {
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`Nager Date HTTP ${r.status}`);
    const list: NagerCountry[] = await r.json();
    const codes = list
      .map((c) => String(c.countryCode || "").toUpperCase())
      .filter(Boolean);
    cache = { ts: Date.now(), codes };
    return new Response(JSON.stringify({ mode: "live", codes }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    // Fallback razonable si Nager está caído
    const fallback = [
      "AR",
      "BR",
      "UY",
      "CL",
      "MX",
      "US",
      "CA",
      "ES",
      "PT",
      "FR",
      "DE",
      "IT",
      "GB",
      "IE",
      "NL",
      "BE",
      "CH",
      "JP",
      "KR",
      "IN",
      "AU",
      "NZ",
      "ZA",
      "TR",
      "AE",
    ];
    cache = { ts: Date.now(), codes: fallback };
    return new Response(
      JSON.stringify({ mode: "fallback", reason: String(e), codes: fallback }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
