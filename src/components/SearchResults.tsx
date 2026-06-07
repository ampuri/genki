import { Link } from 'react-router-dom';
import { highlight, snippetAround } from '../lib/highlight';
import { stripTitlePlain } from '../lib/title';
import type { SearchResult } from '../lib/search';

const ACCENT = '#66BB55';
const EXPR_COLOR = '#3CAEA3';

interface Props {
  results: SearchResult[];
  query: string;
}

export default function SearchResults({ results, query }: Props) {
  if (results.length === 0) {
    return <p className="text-gray-500 text-sm">No matches found.</p>;
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">{results.length} match{results.length !== 1 ? 'es' : ''}</p>
      <ul className="space-y-2">
        {results.map(({ point }) => {
          const color = point.isExpressionNote ? EXPR_COLOR : ACCENT;
          const snippet = snippetAround(point.searchBlob, query, 160);

          return (
            <li key={point.id}>
              <Link
                to={`/point/${point.id}`}
                className="block border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-h-[60px]"
                style={{ borderLeftWidth: '3px', borderLeftColor: color }}
              >
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color }}>
                    {highlight(stripTitlePlain(point.titlePlain), query)}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {point.book === 'Genki II' ? 'II' : 'I'} L{point.lesson}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
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
