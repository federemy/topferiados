// src/pages/api/continents.json.ts
import type { APIRoute } from "astro";

type CountryInfo = {
  code: string;
  name: string;
  continent: "Americas" | "Europe" | "Asia" | "Africa" | "Oceania";
};

const COUNTRIES: CountryInfo[] = [
  // Américas
  { code: "AR", name: "Argentina", continent: "Americas" },
  { code: "BR", name: "Brasil", continent: "Americas" },
  { code: "CL", name: "Chile", continent: "Americas" },
  { code: "UY", name: "Uruguay", continent: "Americas" },
  { code: "PY", name: "Paraguay", continent: "Americas" },
  { code: "BO", name: "Bolivia", continent: "Americas" },
  { code: "PE", name: "Perú", continent: "Americas" },
  { code: "EC", name: "Ecuador", continent: "Americas" },
  { code: "CO", name: "Colombia", continent: "Americas" },
  { code: "VE", name: "Venezuela", continent: "Americas" },
  { code: "MX", name: "México", continent: "Americas" },
  { code: "US", name: "Estados Unidos", continent: "Americas" },
  { code: "CA", name: "Canadá", continent: "Americas" },
  { code: "CR", name: "Costa Rica", continent: "Americas" },
  { code: "PA", name: "Panamá", continent: "Americas" },
  { code: "DO", name: "República Dominicana", continent: "Americas" },
  { code: "CU", name: "Cuba", continent: "Americas" },

  // Europa
  { code: "ES", name: "España", continent: "Europe" },
  { code: "PT", name: "Portugal", continent: "Europe" },
  { code: "FR", name: "Francia", continent: "Europe" },
  { code: "IT", name: "Italia", continent: "Europe" },
  { code: "DE", name: "Alemania", continent: "Europe" },
  { code: "AT", name: "Austria", continent: "Europe" },
  { code: "CH", name: "Suiza", continent: "Europe" },
  { code: "GB", name: "Reino Unido", continent: "Europe" },
  { code: "IE", name: "Irlanda", continent: "Europe" },
  { code: "NL", name: "Países Bajos", continent: "Europe" },
  { code: "BE", name: "Bélgica", continent: "Europe" },
  { code: "DK", name: "Dinamarca", continent: "Europe" },
  { code: "SE", name: "Suecia", continent: "Europe" },
  { code: "NO", name: "Noruega", continent: "Europe" },
  { code: "FI", name: "Finlandia", continent: "Europe" },
  { code: "PL", name: "Polonia", continent: "Europe" },
  { code: "CZ", name: "Chequia", continent: "Europe" },
  { code: "HU", name: "Hungría", continent: "Europe" },
  { code: "RO", name: "Rumania", continent: "Europe" },
  { code: "GR", name: "Grecia", continent: "Europe" },
  { code: "TR", name: "Turquía", continent: "Europe" },

  // Asia
  { code: "CN", name: "China", continent: "Asia" },
  { code: "JP", name: "Japón", continent: "Asia" },
  { code: "KR", name: "Corea del Sur", continent: "Asia" },
  { code: "IN", name: "India", continent: "Asia" },
  { code: "ID", name: "Indonesia", continent: "Asia" },
  { code: "TH", name: "Tailandia", continent: "Asia" },
  { code: "SG", name: "Singapur", continent: "Asia" },
  { code: "MY", name: "Malasia", continent: "Asia" },
  { code: "PH", name: "Filipinas", continent: "Asia" },
  { code: "VN", name: "Vietnam", continent: "Asia" },
  { code: "SA", name: "Arabia Saudita", continent: "Asia" },
  { code: "AE", name: "Emiratos Árabes Unidos", continent: "Asia" },
  { code: "IL", name: "Israel", continent: "Asia" },
  { code: "QA", name: "Catar", continent: "Asia" },
  { code: "BD", name: "Bangladés", continent: "Asia" },
  { code: "PK", name: "Pakistán", continent: "Asia" },
  { code: "LK", name: "Sri Lanka", continent: "Asia" },

  // África
  { code: "ZA", name: "Sudáfrica", continent: "Africa" },
  { code: "EG", name: "Egipto", continent: "Africa" },
  { code: "MA", name: "Marruecos", continent: "Africa" },
  { code: "DZ", name: "Argelia", continent: "Africa" },
  { code: "TN", name: "Túnez", continent: "Africa" },
  { code: "NG", name: "Nigeria", continent: "Africa" },
  { code: "GH", name: "Ghana", continent: "Africa" },
  { code: "KE", name: "Kenia", continent: "Africa" },
  { code: "TZ", name: "Tanzania", continent: "Africa" },
  { code: "ET", name: "Etiopía", continent: "Africa" },

  // Oceanía
  { code: "AU", name: "Australia", continent: "Oceania" },
  { code: "NZ", name: "Nueva Zelanda", continent: "Oceania" },
];

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      continents: ["Americas", "Europe", "Asia", "Africa", "Oceania"],
      countries: COUNTRIES,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
