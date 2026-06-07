import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  const [furiganaHidden, setFuriganaHidden] = useState(
    () => localStorage.getItem('furigana-hidden') === 'true'
  );

  useEffect(() => {
    document.body.classList.toggle('furigana-hidden', furiganaHidden);
    localStorage.setItem('furigana-hidden', String(furiganaHidden));
  }, [furiganaHidden]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight hover:opacity-90">
          Genki Grammar Reference
        </Link>
        <button
          onClick={() => setFuriganaHidden(h => !h)}
          className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded"
          title={furiganaHidden ? 'Show furigana' : 'Hide furigana'}
        >
          {furiganaHidden ? 'Show' : 'Hide'} Furigana
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        Grammar data adapted from{' '}
        <a
          href="https://github.com/SethClydesdale/genki-study-resources"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Genki Study Resources
        </a>{' '}
        by Seth Clydesdale (MIT).
      </footer>
    </div>
  );
}
