import { Link } from 'react-router-dom';
import { Html } from '../lib/ruby';
import { highlight, snippetAround } from '../lib/highlight';
import type { SearchResult } from '../lib/search';

const GENKI1 = '#FF9933';
const GENKI2 = '#66BB55';

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
          const accent = point.book === 'Genki II' ? GENKI2 : GENKI1;
          const snippet = snippetAround(point.searchBlob, query, 160);

          return (
            <li key={point.id}>
              <Link
                to={`/point/${point.id}`}
                className="block border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-h-[60px]"
                style={{ borderLeftWidth: '3px', borderLeftColor: accent }}
              >
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: accent }}>
                    <Html html={point.title} />
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: `${accent}20`, color: accent }}
                  >
                    {point.book === 'Genki II' ? 'II' : 'I'} L{point.lesson}
                  </span>
                  <span className="text-xs text-gray-400">{point.page}</span>
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
