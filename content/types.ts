// Kształt plików content/{pl,en}.json

export interface Tech {
  name: string;
  detail?: string;
  strong?: boolean;
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

export interface ExperienceEntry {
  period: string;
  role?: string;
  text?: string[];
  projects?: string[];
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

export interface Recommendation {
  id: string;
  author: string;
  position?: string;
  company: string;
  date?: string;
  text: RecommendationBlock[];
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

export interface ProjectLink {
  href: string;
  label: string;
}

// Case study: kontekst, rola, co zrobiłem i stack. Wyróżniony projekt
// (featured) dostaje szeroki układ z problemem, liczbami i podglądem mapy.
export interface Project {
  id: string;
  featured?: boolean;
  name: string;
  context: string;
  role: string;
  problem?: string;
  text: string[];
  facts?: ProjectFact[];
  stack: string;
  link?: ProjectLink;
}

export interface ProjectsSection {
  title: string;
  intro?: string;
  items: Project[];
}

export interface ContactSection {
  title: string;
}

export interface Content {
  about: About;
  experience: ExperienceSection;
  // sekcja projektów jest na razie tylko po polsku
  projects?: ProjectsSection;
  stack: StackGroup[];
  recommendations: RecommendationsSection;
  contact: ContactSection;
}
