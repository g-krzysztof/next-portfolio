// Kształt plików content/{pl,en}.json

export interface Tech {
  name: string;
  detail?: string;
  // ważność w chmurze stacku: strong = duże, minor = małe, brak = średnie
  strong?: boolean;
  minor?: boolean;
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
  | string
  | { text: string; more?: { href: string; label: string } };

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

export interface ExperienceSection {
  title: string;
  intro?: string;
  entries: ExperienceEntry[];
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

// Druga karta projektu: pozostałe zadania z tego samego miejsca pracy
export interface ProjectOtherTasks {
  tab: string;
  items: string[];
}

export interface ProjectLink {
  href: string;
  label: string;
}

// Case study: kontekst, rola, co zrobiłem i stack. Wyróżniony projekt
// (featured) dostaje szeroki układ z problemem, liczbami i podglądem mapy.
export interface Project {
  id: string;
  featured?: boolean;
  // ilustracja przy wyróżnionym projekcie: 'map' | 'editor' | 'players' (JSON daje string)
  visual?: string;
  // etykieta karty z case study; karty włącza otherTasks albo wspólna group
  tab?: string;
  // kolejne projekty z tą samą grupą pokazują się jako karty jednego bloku
  group?: string;
  otherTasks?: ProjectOtherTasks;
  name: string;
  context: string;
  role: string;
  problem?: string;
  // opis produktu, gdy praca była przy rozwoju istniejącego narzędzia
  product?: string[];
  text: string[];
  facts?: ProjectFact[];
  factsSource?: string;
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
