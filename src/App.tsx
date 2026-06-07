import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

const ACCENT = '#66BB55';
const ACCENT_DARK = '#5A9944';

export default function App() {
  const [furiganaHidden, setFuriganaHidden] = useState(
    () => localStorage.getItem('furigana-hidden') === 'true'
  );

  useEffect(() => {
    document.body.classList.toggle('furigana-hidden', furiganaHidden);
    localStorage.setItem('furigana-hidden', String(furiganaHidden));
  }, [furiganaHidden]);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ color: '#333' }}>
      <header
        className="text-white px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: ACCENT }}
      >
        <Link to="/" className="text-base font-bold tracking-tight hover:opacity-90">
          Genki Grammar Reference
        </Link>
        <button
          onClick={() => setFuriganaHidden(h => !h)}
          className="text-sm px-3 py-1 rounded"
          style={{ backgroundColor: ACCENT_DARK }}
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
          style={{ color: ACCENT }}
          className="underline"
        >
          Genki Study Resources
        </a>{' '}
        by Seth Clydesdale (MIT).
      </footer>
    </div>
  );
}
