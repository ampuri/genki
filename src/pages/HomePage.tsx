import { useState, useDeferredValue } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import LessonToc from '../components/LessonToc';
import { search } from '../lib/search';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = deferredQuery.trim().length >= 2 ? search(deferredQuery) : [];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Genki Grammar Reference</h1>
        <p className="text-sm text-gray-500 mt-0.5">Genki I &amp; II (3rd Edition) — {' '}
          <span className="font-medium">197 grammar points</span>
        </p>
      </div>

      <SearchBox value={query} onChange={setQuery} />

      {query.trim().length >= 2
        ? <SearchResults results={results} query={deferredQuery} />
        : <LessonToc />
      }
    </div>
  );
}
