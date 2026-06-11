# Izabela Pawlak — Portfolio

Interaktywne portfolio Tech & Ops: animowana oś czasu kariery, siatka umiejętności oraz w pełni klikalne makiety narzędzi (planowanie zmian, generator umów, panel HR).

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Strona wystartuje pod `http://localhost:3000`.

## Struktura

| Ścieżka | Opis |
|---|---|
| `src/App.tsx` | Główny układ strony i nagłówek z kontaktami |
| `src/components/` | Sekcje strony (oś czasu, umiejętności, „Dlaczego ja?", stopka CTA) oraz okna makiet |
| `src/data.ts` | Treści: wydarzenia osi czasu, lista umiejętności |
| `public/schedule.html`, `public/contract.html`, `public/hr.html` | Samodzielne, interaktywne makiety otwierane w oknach modalnych |
| `public/hr.gs`, `public/backend.js` | Kod źródłowy narzędzi Google Apps Script pokazywanych w makietach |

## Publikacja (GitHub Pages)

Repozytorium zawiera workflow `.github/workflows/deploy.yml`, który po każdym pushu na `main` buduje projekt i publikuje go na GitHub Pages.

Jednorazowa konfiguracja: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Strona będzie dostępna pod adresem: `https://ipawlak00.github.io/portfolio/`
