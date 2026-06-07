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
      <div className="sticky top-16 z-40 bg-white py-2 -mx-3 px-3 sm:-mx-4 sm:px-4 border-b border-gray-100 mb-4">
        <SearchBox value={query} onChange={setQuery} />
      </div>

      {query.trim().length >= 1
        ? <SearchResults results={results} query={deferredQuery} />
        : <LessonToc />
      }
    </div>
  );
}
