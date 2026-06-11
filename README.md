# Izabela Pawlak — Portfolio

Interaktywne portfolio: animowana oś czasu kariery, siatka umiejętności i sekcja projektów (Google Apps Script, Looker Studio, automatyzacje).

## Struktura repozytorium

| Plik / folder | Opis |
|---|---|
| `index.html` | Samodzielna wersja strony — działa bezpośrednio w przeglądarce i na **GitHub Pages**, bez Google Apps Script |
| `profile.jpeg` | Zdjęcie profilowe używane przez stronę |
| `apps-script/Code.gs` | Kod serwerowy projektu Google Apps Script (`doGet`, `handleButtonClick`) |
| `apps-script/Index.html` | Szablon HTML wdrażany jako Web App w Google Apps Script |

Obie wersje strony mają identyczny wygląd. Różnica: wersja Apps Script pobiera treść sekcji „Kim jestem?" z serwera przez `google.script.run`, a wersja statyczna ma tę treść wbudowaną w JavaScript (na GitHub Pages nie ma backendu Apps Script).

## Jak opublikować na GitHub Pages

1. Wejdź w **Settings → Pages** tego repozytorium.
2. W sekcji **Build and deployment** wybierz `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Po chwili strona będzie dostępna pod adresem: `https://ipawlak00.github.io/portfolio/`

Ten link możesz wysyłać rekruterom — otwiera się od razu, bez logowania do konta Google.

## Jak zaktualizować wersję Apps Script

Edytuj pliki w folderze `apps-script/`, a następnie wklej ich zawartość do edytora na [script.google.com](https://script.google.com) (plik `Code.gs` i plik HTML o nazwie `Index`). Wdróż jako **Web App** (`Deploy → New deployment`).

> Uwaga: jeśli wdrożenie jest na koncie firmowym (`/a/macros/randstad.pl/`), linki do aplikacji będą działać tylko dla osób zalogowanych w tej domenie. Dla rekruterów spoza firmy lepszy jest link GitHub Pages.
