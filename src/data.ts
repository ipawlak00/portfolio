import { ProjectItem, WhyCardItem, ProcessItem } from "./types";

export const projectsData: ProjectItem[] = [
  {
    id: 0,
    shortLabel: "Analityka Sprzedaży (BI)",
    title: "Sales Analytics & BI Workspace",
    text: "Samodzielnie poprowadziłam budowę dedykowanej aplikacji dla działów sprzedaży — od zebrania potrzeb po wdrożenie — łącząc dane z codzienną pracą zespołów w terenie. Handlowcy dostali proste narzędzie, a menedżerowie pełen, oparty na danych wgląd w wyniki.<br><br><b>Kompetencje w praktyce:</b><ul class='timeline-list'><li><b>Decyzje oparte na danych (Data-Driven):</b> centralizacja danych z wielu systemów (BigQuery) i interaktywne dashboardy KPI w Looker Studio, dostępne dla zarządu w czasie rzeczywistym.</li><li><b>Analiza i optymalizacja procesów:</b> mapowanie oraz digitalizacja procesów (wyceny, onboarding), co ograniczyło błędy i odciążyło zespół operacyjny.</li><li><b>Analiza potrzeb i architektura rozwiązania:</b> zaprojektowanie ekosystemu spinającego sprzedaż, finanse i logistykę w jeden, płynny proces.</li></ul>",
    link: "https://lookerstudio.google.com/"
  },
  {
    id: 1,
    shortLabel: "Onboarding & Operacje",
    title: "Onboarding & Fleet Operations",
    text: "Poprowadziłam budowę środowiska zatrudnienia od A do Z — od koncepcji po wdrożenie — zmieniając chaotyczny onboarding setek osób w zautomatyzowany, powtarzalny proces.<br><br><b>Kompetencje w praktyce:</b><ul class='timeline-list'><li><b>Prowadzenie inicjatywy i priorytetyzacja:</b> rozbicie złożonego procesu zatrudniania na powtarzalne kroki — od podpisania umowy po pierwszy dzień pracy.</li><li><b>Doskonałość operacyjna i automatyzacja:</b> zastąpienie ręcznych tabel automatycznymi powiadomieniami, e-mailami i rezerwacją sprzętu floty (zarządzanie zasobami).</li><li><b>Poprawa SLA i ciągłe doskonalenie (Continuous Improvement):</b> skrócenie przestojów HR oraz eliminacja powracających braków sprzętowych.</li></ul>",
    link: "https://script.google.com/"
  },
  {
    id: 2,
    shortLabel: "Workforce Management",
    title: "Workforce Management (WFM)",
    text: "System zarządzania czasem pracy dla ponad 300 osób. Zebrałam potrzeby biznesu i przełożyłam je na funkcje prostej, gotowej aplikacji rozliczeniowej.<br><br><b>Kompetencje w praktyce:</b><ul class='timeline-list'><li><b>Zbieranie wymagań (Requirements) i MVP:</b> warsztaty z managerami i działem płac, priorytetyzacja problemów i dostarczenie Minimum Viable Product.</li><li><b>Optymalizacja procesu i kontrola ryzyka:</b> automatyczna weryfikacja nadgodzin i niedoborów, chroniąca firmę przed ryzykiem kadrowym.</li><li><b>User Experience (UX):</b> jeden czytelny widok dostarczający od razu wszystkie dane produkcyjne i rozliczeniowe.</li></ul>",
    link: "https://workspace.google.com/"
  },
  {
    id: 3,
    shortLabel: "Cykl Życia Pracownika",
    title: "Employee Lifecycle Management",
    text: "Digitalizacja Back-Office: zamiast tysiąca rozproszonych plików — jedno spójne, intuicyjne narzędzie aplikacyjne łączące działy w firmie.<br><br><b>Kompetencje w praktyce:</b><ul class='timeline-list'><li><b>Mapowanie procesów As-Is / To-Be:</b> przeprojektowanie przepływu informacji i ustalenie nowych standardów pracy (SOP).</li><li><b>Zarządzanie ryzykiem i compliance:</b> przełożenie trudnych przepisów na automatyczne alerty (np. limit absencji / 540 dni).</li><li><b>Single Source of Truth:</b> centralna baza danych, z której działy bezpiecznie wymieniają informacje o ludziach i zasobach (szafki, karty).</li></ul>",
    link: "https://sheets.google.com/"
  },
  {
    id: 4,
    shortLabel: "Automatyzacja Umów",
    title: "System Zarządzania Umowami",
    text: "Praca analityczna na danych kadrowych: przełożyłam zawiłe reguły korporacyjne na przejrzysty, zautomatyzowany system przedłużania tysięcy umów, zdejmując z zespołu żmudną decyzyjność.<br><br><b>Kompetencje w praktyce:</b><ul class='timeline-list'><li><b>Przekładanie logiki biznesowej na reguły:</b> mapowanie warunków (staż, absencje) na automatyczną propozycję nowej umowy.</li><li><b>Quality Assurance i standaryzacja:</b> eliminacja ryzykownych \"pomyłek z Excela\" i gwarancja powtarzalności decyzji.</li><li><b>Efektywność operacyjna:</b> odzyskanie dziesiątek godzin pracy zespołu — czas na rekrutacje zamiast przeklikiwania dokumentacji.</li></ul>",
    link: "https://docs.google.com/"
  },
  {
    id: 5,
    shortLabel: "Discovery & Prototypowanie",
    title: "Product Discovery & Prototypowanie UX",
    text: "Rola pomostu między biznesem, użytkownikami i wdrożeniem. Przeprowadziłam całościowy redesign złożonego harmonogramowania widocznego dla setek pracowników.<br><br><b>Kompetencje w praktyce:</b><ul class='timeline-list'><li><b>Product Discovery i User Research:</b> zbieranie feedbacku operacyjnego od użytkowników, by trafnie zdefiniować problem i potrzeby.</li><li><b>Prototypowanie i makiety:</b> buduję klikalne, realnie działające makiety w Google Apps Script (HTML Service) — testowane z użytkownikami, a nie martwe statyczne ekrany.</li><li><b>Stakeholder management:</b> walidacja makiet z interesariuszami z wyprzedzeniem — budowanie dokładnie tego, czego potrzebują.</li></ul>",
    link: "https://figma.com/"
  }
];

export const skillsList: string[] = [
  "Product Ownership",
  "Mapowanie Procesów",
  "Optymalizacja",
  "Agile / Scrum",
  "Looker Studio",
  "AppScripts",
  "SQL",
  "Automatyzacje",
  "Dashboardy",
  "Analizy",
  "JavaScript",
  "HTML",
  "CSS",
  "Tableau",
  "Komunikacja",
  "Kreatywność",
  "Humor"
];

export const whyMeCards: WhyCardItem[] = [
  {
    number: "01",
    title: "Od problemu do wdrożenia",
    description: "Sama prowadzę rozwiązanie end-to-end: od analizy i mapowania procesu, przez prototyp, po automatyzację i wdrożenie."
  },
  {
    number: "02",
    title: "Użytkownik i adopcja zmian",
    description: "Projektuję narzędzia pod realnego użytkownika (UX) i prowadzę zespół przez zmianę — z naciskiem na intuicyjność i niski opór."
  },
  {
    number: "03",
    title: "Decyzje oparte na danych",
    description: "Szukam powtarzalnych wzorców i opieram decyzje na danych — buduję dashboardy (Looker, Tableau), które stają się źródłem prawdy."
  }
];

export const processSteps: ProcessItem[] = [
  {
    step: "01",
    title: "Mapowanie",
    description: "Analizuję procesy w stanie obecnym (\"as-is\"), rozmawiam z użytkownikami i lokalizuję kosztowne wąskie gardła."
  },
  {
    step: "02",
    title: "Architektura",
    description: "Tłumaczę chaotyczne wymagania biznesowe na czystą logikę systemową, relacje danych i intuicyjne schematy UX."
  },
  {
    step: "03",
    title: "Automatyzacja",
    description: "Wykorzystując skrypty i Google Workspace, bezlitośnie eliminuję powtarzalną, manualną pracę zespołu operacyjnego."
  },
  {
    step: "04",
    title: "Adopcja",
    description: "Wdrażam system i prowadzę zespoły przez zmianę, stawiając na wysoką komunikatywność i maksymalne zaangażowanie."
  }
];
