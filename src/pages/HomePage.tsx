import { useState, useEffect, useDeferredValue } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import LessonToc from '../components/LessonToc';
import ViewBar from '../components/ViewBar';
import { search } from '../lib/search';
import { getView } from '../lib/views';

function initialView(): string | null {
  const v = localStorage.getItem('active-view');
  return v && getView(v) ? v : null;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState<string | null>(initialView);
  const deferredQuery = useDeferredValue(query);
  const searching = query.trim().length >= 1;

  useEffect(() => {
    if (activeView) localStorage.setItem('active-view', activeView);
    else localStorage.removeItem('active-view');
  }, [activeView]);

  let results = searching ? search(deferredQuery) : [];
  if (activeView) results = results.filter(r => r.point.views.includes(activeView));

  return (
    <div>
      <div
        className="sticky z-40 bg-[var(--bg)] py-2 -mt-4 sm:-mt-6 -mx-3 px-3 sm:-mx-4 sm:px-4 border-b border-[var(--border)] mb-4"
        style={{ top: 'calc(3.25rem + max(0.75rem, env(safe-area-inset-top)))' }}
      >
        <SearchBox value={query} onChange={setQuery} />
        <div className="mt-2">
          <ViewBar activeView={activeView} onChange={setActiveView} />
        </div>
      </div>

      {searching
        ? <SearchResults results={results} query={deferredQuery} />
        : <LessonToc view={activeView} />
      }
    </div>
  );
}
