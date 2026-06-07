import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SideNav from './components/SideNav';
import HomePage from './pages/HomePage';
import PointPage from './pages/PointPage';
import NotFound from './pages/NotFound';

type Theme = 'light' | 'dark';

type Overlay = { kind: 'point'; id: string } | { kind: 'notfound' } | null;

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

  const pointMatch = location.pathname.match(/^\/point\/(.+)$/);
  const currentPointId = pointMatch ? pointMatch[1] : undefined;
  const isUnknown = location.pathname !== '/' && !pointMatch;
  const overlayRoute = location.pathname !== '/';

  // The overlay is a stacked view layered over the always-mounted HomePage.
  // `shown` is what it renders; it lingers during the slide-out so the panel
  // doesn't blank mid-animation. `active` drives the slide transform.
  const [shown, setShown] = useState<Overlay>(() =>
    currentPointId ? { kind: 'point', id: currentPointId } : isUnknown ? { kind: 'notfound' } : null
  );
  const [active, setActive] = useState(overlayRoute);
  const overlayScrollRef = useRef<HTMLDivElement>(null);

  // Take over scroll restoration; we never move the window on navigation now,
  // so the homepage simply stays where the user left it behind the overlay.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  // Drive the overlay enter/exit animation from the route.
  useEffect(() => {
    if (currentPointId) {
      setShown({ kind: 'point', id: currentPointId });
      const r = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(r);
    }
    if (isUnknown) {
      setShown({ kind: 'notfound' });
      const r = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(r);
    }
    setActive(false);
    const t = setTimeout(() => setShown(null), 280);
    return () => clearTimeout(t);
  }, [currentPointId, isUnknown]);

  // Each point opens at the top of its own scroll container.
  useLayoutEffect(() => {
    if (shown?.kind === 'point' && overlayScrollRef.current) {
      overlayScrollRef.current.scrollTop = 0;
    }
  }, [shown?.kind === 'point' ? shown.id : null]);

  // Lock the page behind the overlay so touch scrolling doesn't bleed through
  // and the homepage scroll position is held intact.
  useEffect(() => {
    if (!overlayRoute) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [overlayRoute]);

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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      {/* ── Header ── */}
      <header
        className="flex items-center gap-3 sticky top-0 z-50 bg-[var(--header-bg)] text-[var(--header-ink)] shadow-[0_1px_0_0_var(--header-border)]"
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

      {/* ── Main content (always mounted) ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <HomePage />
      </main>

      {/* ── Point overlay (stacked view) ──
          Sits below the static header so its scroll container — and thus its
          scrollbar — starts under the header rather than running behind it. */}
      <div
        ref={overlayScrollRef}
        className="fixed left-0 right-0 bottom-0 z-40 overflow-y-auto overscroll-contain bg-[var(--bg)] transition-transform duration-[280ms] ease-out"
        style={{
          top: 'calc(3.25rem + max(0.75rem, env(safe-area-inset-top)))',
          transform: active ? 'translateX(0)' : 'translateX(100%)',
          visibility: shown ? 'visible' : 'hidden',
        }}
        aria-hidden={!active}
      >
        <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
          {shown?.kind === 'point' && <PointPage id={shown.id} />}
          {shown?.kind === 'notfound' && <NotFound />}
        </div>
      </div>

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
