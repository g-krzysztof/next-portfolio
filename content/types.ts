// Kształt plików content/{pl,en}.json

export interface Tech {
  name: string;
  detail?: string;
  // ważność w chmurze stacku: strong = duże, minor = małe, brak = średnie
  strong?: boolean;
  minor?: boolean;
  // miejsce na pasku awersu wizytówki (1 = pierwsze); bez pola nie trafia na pasek
  front?: number;
}

// Linia stacku to kilka technologii, które w CV stoją obok siebie
export type StackLine = Tech[];

export interface StackGroup {
  title: string;
  lines: StackLine[];
}

export interface About {
  lead: string;
  statement?: string;
  body: string[];
}

// Część kolumny osi czasu: kilka krótkich etapów może dzielić jedną kolumnę
export interface ExperiencePart {
  period: string;
  role?: string;
  text: string[];
}

// Punkt projektu: sam tekst albo tekst z przyciskiem „Więcej” do sekcji projektów
export type ExperienceProject =
  string | { text: string; more?: { href: string; label: string } };

export interface ExperienceEntry {
  period: string;
  // szkic z danego okresu, ścieżka od public/
  image?: string;
  imageAlt?: string;
  role?: string;
  text?: string[];
  projects?: ExperienceProject[];
  stack?: string[];
  parts?: ExperiencePart[];
}

// Projekt po godzinach, pod osią czasu, oddzielony linią
export interface ExperienceSideProject {
  period: string;
  role: string;
  text: string[];
  stack?: string;
  more?: { href: string; label: string };
}

export interface ExperienceSection {
  title: string;
  intro?: string;
  entries: ExperienceEntry[];
  sideProject?: ExperienceSideProject;
}

// Akapit opinii to tekst albo wypunktowanie
export type RecommendationBlock = string | { list: string[] };

// Rolka na karcie opinii: cytaty i zdanie polecające to dosłowne fragmenty `text`
export interface RecommendationReel {
  fact?: { value: string; label: string };
  quotes: { text: string; mark?: string }[];
  closing: string;
}

export interface Recommendation {
  id: string;
  author: string;
  position?: string;
  company: string;
  date?: string;
  // adres rekomendacji na LinkedIn, gdy jest tam opublikowana
  linkedin?: string;
  text: RecommendationBlock[];
  reel?: RecommendationReel;
}

export interface RecommendationsSection {
  title: string;
  intro?: string;
  items: Recommendation[];
}

export interface ProjectFact {
  value: string;
  label: string;
}

// korzyść dla projektu: krótki tytuł i jedno zdanie, gdy liczby nic nie mówią
export interface ProjectOutcome {
  title: string;
  text: string;
}

// Zrzut ekranu projektu: plik 16:9 w public/, podpis na przełączniku galerii
export interface ProjectShot {
  src: string;
  alt: string;
  label: string;
  caption?: string;
}

export interface ProjectLink {
  href: string;
  label: string;
}

// Decyzja w „Co zrobiłem”: pogrubiony skrót i jedno-dwa zdania uzasadnienia
export interface ProjectDecision {
  title: string;
  text: string;
}

// Obraz w panelu szczegółów, w naturalnych proporcjach (ścieżka od public/)
export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Blok podsekcji szczegółów: akapit, kroki (lista numerowana), lista albo obrazy obok siebie
export type ProjectDetailBlock =
  | string
  | { steps: string[] }
  | { list: string[] }
  | { images: ProjectImage[] };

// Podsekcja panelu „Pokaż szczegóły”
export interface ProjectDetail {
  title: string;
  blocks: ProjectDetailBlock[];
}

// Case study: kontekst, rola, co zrobiłem i stack. Wyróżniony projekt
// (featured) dostaje szeroki układ z problemem, liczbami i podglądem mapy.
export interface Project {
  id: string;
  featured?: boolean;
  // ilustracja przy wyróżnionym projekcie: 'map' | 'editor' | 'players' (JSON daje string)
  visual?: string;
  // zamiast ilustracji w kodzie: galeria zrzutów ekranu
  shots?: ProjectShot[];
  // etykieta karty z case study; karty włącza wspólna group
  tab?: string;
  // dopisek pod etykietą karty: firma lub klient
  tabNote?: string;
  // kolejne projekty z tą samą grupą pokazują się jako karty jednego bloku
  group?: string;
  name: string;
  context: string;
  role: string;
  problem?: string;
  // opis produktu, gdy praca była przy rozwoju istniejącego narzędzia
  product?: string[];
  // akapity „Co zrobiłem”: pierwszy widać od razu, reszta w szczegółach
  text?: string[];
  // zamiast akapitów: lista decyzji, cała widoczna od razu
  decisions?: ProjectDecision[];
  // podsekcje panelu „Pokaż szczegóły”, po akapitach pracy
  details?: ProjectDetail[];
  facts?: ProjectFact[];
  factsSource?: string;
  outcomes?: ProjectOutcome[];
  stack: string;
  // linki do case study albo stron demo
  links?: ProjectLink[];
}

export interface ProjectsSection {
  title: string;
  intro?: string;
  items: Project[];
}

// Blok „Praktycznie”: język, tryb pracy, lokalizacja, forma współpracy, dostępność
export interface PracticalItem {
  label: string;
  value: string;
}

export interface ContactSection {
  title: string;
  practical?: {
    title: string;
    items: PracticalItem[];
  };
}

export interface Content {
  about: About;
  experience: ExperienceSection;
  projects?: ProjectsSection;
  stack: StackGroup[];
  recommendations: RecommendationsSection;
  contact: ContactSection;
}
