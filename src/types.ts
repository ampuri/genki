export interface Example { jp: string; en: string; }
export interface Honbun { text: string; ref?: string; }
export interface LinkRef { text: string; href: string; }
export interface SupGroup { label: string; links: LinkRef[]; }

export interface GrammarPoint {
  id: string;
  lesson: number;
  order: number;
  isExpressionNote: boolean;
  title: string;
  titlePlain: string;
  book: 'Genki I' | 'Genki II';
  page: string;
  keywords: string[];
  honbun: Honbun[];
  explanation: string;
  supplemental: SupGroup[];
  englishEquivalent: string;
  patterns: string[];
  examples: Example[];
  practice: LinkRef[];
  searchBlob: string;
}

export interface LessonGroup {
  lesson: number;
  book: 'Genki I' | 'Genki II';
  title: string;
  points: GrammarPoint[];
}
