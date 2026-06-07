import Fuse from 'fuse.js';
import { allPoints } from './data';
import type { GrammarPoint } from '../types';

const fuse = new Fuse(allPoints, {
  keys: [
    { name: 'titlePlain', weight: 3 },
    { name: 'keywords', weight: 2 },
    { name: 'searchBlob', weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 1,
  includeScore: true,
  includeMatches: true,
});

export interface SearchResult {
  point: GrammarPoint;
  score: number;
  matchedField?: string;
}

const fieldPriority = (f?: string) =>
  f === 'titlePlain' ? 0 : f === 'keywords' ? 1 : 2;

export function search(query: string): SearchResult[] {
  if (!query.trim()) return [];
  return fuse
    .search(query)
    .map(r => ({
      point: r.item,
      score: r.score ?? 1,
      matchedField: r.matches?.[0]?.key ?? undefined,
    }))
    .sort((a, b) => {
      const pd = fieldPriority(a.matchedField) - fieldPriority(b.matchedField);
      return pd !== 0 ? pd : a.score - b.score;
    });
}
