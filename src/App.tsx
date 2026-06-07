import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SideNav from './components/SideNav';

type Theme = 'light' | 'dark';

function initialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [furiganaHidden, setFuriganaHidden] = useState(
    () => localStorage.getItem('furigana-hidden') === 'true'
  );
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const homeScrollRef = useRef(0);

  // Take over scroll restoration so we control it per-route.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  // Remember the homepage scroll position while we're on it.
  useEffect(() => {
    if (location.pathname !== '/') return;
    const onScroll = () => { homeScrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Point pages always open at the top; the homepage restores where you left it.
  useLayoutEffect(() => {
    window.scrollTo(0, location.pathname === '/' ? homeScrollRef.current : 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('furigana-hidden', furiganaHidden);
    localStorage.setItem('furigana-hidden', String(furiganaHidden));
  }, [furiganaHidden]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#141815' : '#338a3e');
  }, [theme]);

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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      {/* ── Header ── */}
      <header
        className="flex items-center gap-3 sticky top-0 z-50 bg-[var(--header-bg)] text-[var(--header-ink)] border-b border-[var(--header-border)]"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: '0.75rem',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        {/* Hamburger on left */}
        <button
          onClick={() => setNavOpen(o => !o)}
          className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-lg shrink-0 touch-manipulation hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20 transition-colors"
          aria-label="Open menu"
          aria-expanded={navOpen}
        >
          <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${navOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${navOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${navOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
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
          theme={theme}
          onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          onClose={() => setNavOpen(false)}
        />
      </div>
    </div>
  );
}
