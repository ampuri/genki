import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SideNav from './components/SideNav';

const ACCENT = '#66BB55';

export default function App() {
  const [furiganaHidden, setFuriganaHidden] = useState(
    () => localStorage.getItem('furigana-hidden') === 'true'
  );
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('furigana-hidden', furiganaHidden);
    localStorage.setItem('furigana-hidden', String(furiganaHidden));
  }, [furiganaHidden]);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (navOpen) {
      const close = () => setNavOpen(false);
      window.addEventListener('popstate', close);
      return () => window.removeEventListener('popstate', close);
    }
  }, [navOpen]);

  const match = location.pathname.match(/^\/point\/(.+)$/);
  const currentPointId = match ? match[1] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ color: '#333' }}>
      {/* ── Header ── */}
      <header
        className="text-white flex items-center gap-3 sticky top-0 z-50"
        style={{
          backgroundColor: ACCENT,
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: '0.75rem',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        {/* Hamburger on left */}
        <button
          onClick={() => setNavOpen(o => !o)}
          className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-lg shrink-0 touch-manipulation hover:bg-white/10 active:bg-white/20 transition-colors"
          aria-label="Open menu"
          aria-expanded={navOpen}
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${navOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${navOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${navOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>

        <Link to="/" className="font-bold tracking-tight hover:opacity-90 flex-1 min-w-0 leading-tight">
          <span className="sm:hidden text-sm">文法 Reference</span>
          <span className="hidden sm:inline text-base">Genki Grammar Reference</span>
        </Link>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <Outlet />
      </main>

      {/* ── Backdrop ── */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Side panel ── */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 ease-out"
        style={{ transform: navOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <SideNav
          currentPointId={currentPointId}
          isOpen={navOpen}
          furiganaHidden={furiganaHidden}
          onToggleFurigana={() => setFuriganaHidden(h => !h)}
          onClose={() => setNavOpen(false)}
        />
      </div>
    </div>
  );
}
