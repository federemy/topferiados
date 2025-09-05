# 🎉 Feriados — Comparador buen onda

App web para ver **feriados nacionales** por país y año, con:

- Próximo feriado y contador de días ⏳
- Lista de feriados del país elegido 📅
- Ranking por **continente** y **Top 10 mundial** (incluye tu país) 🌎
- **Animación festiva** automática si estamos cerca de un feriado (±2 días) 🥳
- UI en español, tipografía amable (Nunito) y Bootstrap 5

**Stack:** [Astro](https://astro.build) + Endpoints serverless (TypeScript)

**Fuente de datos:** [Nager.Date](https://date.nager.at) (gratis, sin API key).  
**Metadatos de países/continentes:** `restcountries.com` (solo para armar los listados).

---

## 🚀 Demo local

```bash
# 1) Instalar dependencias
npm i

# 2) Correr en desarrollo
npm run dev
# abre: http://localhost:4321

# 3) Build de producción (opcional)
npm run build
npm run preview
```
