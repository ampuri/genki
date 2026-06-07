import { Link } from 'react-router-dom';
import { highlight, snippetAround } from '../lib/highlight';
import { stripTitlePlain } from '../lib/title';
import { accentVar, accentSoftVar } from '../lib/accent';
import type { SearchResult } from '../lib/search';

interface Props {
  results: SearchResult[];
  query: string;
}

export default function SearchResults({ results, query }: Props) {
  if (results.length === 0) {
    return <p className="text-[var(--ink-soft)] text-sm">No matches found.</p>;
  }

  return (
    <div>
      <p className="text-sm text-[var(--ink-faint)] mb-3">
        {results.length} match{results.length !== 1 ? 'es' : ''}
      </p>
      <ul className="space-y-2.5">
        {results.map(({ point }) => {
          const accent = accentVar(point);
          const soft = accentSoftVar(point);
          const snippet = snippetAround(point.searchBlob, query, 160);

          return (
            <li key={point.id}>
              <Link
                to={`/point/${point.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:bg-[var(--hover)] active:bg-[var(--active)] transition-colors touch-manipulation"
                style={point.isExpressionNote ? undefined : { borderLeftWidth: '3px', borderLeftColor: accent }}
              >
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="font-semibold text-[15px] text-[var(--ink)]">
                    {highlight(stripTitlePlain(point.titlePlain), query)}
                  </span>
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: soft, color: accent }}
                  >
                    {point.book === 'Genki II' ? 'II' : 'I'} · L{point.lesson}
                  </span>
                </div>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                  {highlight(snippet, query)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
