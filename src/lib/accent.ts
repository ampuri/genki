/** Per-book accent color, as a CSS var reference.
 *  Genki I = orange, Genki II = green. Grammar and expression notes share it. */
type PointLike = { book: 'Genki I' | 'Genki II' };

export function accentVar(p: PointLike): string {
  return p.book === 'Genki I' ? 'var(--book1)' : 'var(--book2)';
}

export function accentSoftVar(p: PointLike): string {
  return p.book === 'Genki I' ? 'var(--book1-soft)' : 'var(--book2-soft)';
}

export function bookColorVar(book: 'Genki I' | 'Genki II'): string {
  return book === 'Genki I' ? 'var(--book1)' : 'var(--book2)';
}
