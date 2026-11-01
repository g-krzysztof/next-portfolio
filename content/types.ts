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
  statement: string;
  body: string;
}

export interface ExperienceEntry {
  period: string;
  role?: string;
  text: string[];
  projects?: string[];
  stack?: string[];
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

export interface ContactSection {
  title: string;
}

export interface Content {
  about: About;
  experience: ExperienceSection;
  stack: StackGroup[];
  recommendations: RecommendationsSection;
  contact: ContactSection;
}
