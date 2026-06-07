import { Link } from 'react-router-dom';
import { Html } from '../lib/ruby';
import { highlight, snippetAround } from '../lib/highlight';
import type { SearchResult } from '../lib/search';

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
          const snippet = snippetAround(point.searchBlob, query, 160);

          return (
            <li key={point.id}>
              <Link
                to={`/point/${point.id}`}
                className="block border border-gray-200 rounded-lg px-4 py-3 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="font-semibold text-indigo-700">
                    <Html html={point.title} />
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    {point.book} L{point.lesson}
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
