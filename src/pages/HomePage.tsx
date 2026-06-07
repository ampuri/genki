import { useState, useDeferredValue } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import LessonToc from '../components/LessonToc';
import { search } from '../lib/search';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = deferredQuery.trim().length >= 1 ? search(deferredQuery) : [];

  return (
    <div>
      <div className="sticky top-16 z-40 bg-[var(--bg)] pt-1 pb-2 -mt-4 sm:-mt-6 -mx-3 px-3 sm:-mx-4 sm:px-4 border-b border-[var(--border)] mb-4">
        <SearchBox value={query} onChange={setQuery} />
      </div>

      {query.trim().length >= 1
        ? <SearchResults results={results} query={deferredQuery} />
        : <LessonToc />
      }
    </div>
  );
}
