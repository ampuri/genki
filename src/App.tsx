import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

const ACCENT = '#66BB55';
const ACCENT_DARK = '#5A9944';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function App() {
  const [furiganaHidden, setFuriganaHidden] = useState(
    () => localStorage.getItem('furigana-hidden') === 'true'
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(
    () => localStorage.getItem('install-dismissed') === 'true'
  );

  useEffect(() => {
    document.body.classList.toggle('furigana-hidden', furiganaHidden);
    localStorage.setItem('furigana-hidden', String(furiganaHidden));
  }, [furiganaHidden]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Close drawer on back navigation
  useEffect(() => {
    if (drawerOpen) {
      const close = () => setDrawerOpen(false);
      window.addEventListener('popstate', close);
      return () => window.removeEventListener('popstate', close);
    }
  }, [drawerOpen]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
    setDrawerOpen(false);
  };

  const showBanner = installPrompt && !installDismissed;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ color: '#333' }}>
      {/* ── Header ── */}
      <header
        className="text-white flex items-center justify-between gap-3 sticky top-0 z-50"
        style={{
          backgroundColor: ACCENT,
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: '0.75rem',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <Link to="/" className="font-bold tracking-tight hover:opacity-90 leading-tight min-w-0 flex-1">
          <span className="sm:hidden text-sm">文法 Reference</span>
          <span className="hidden sm:inline text-base">Genki Grammar Reference</span>
        </Link>

        {/* Furigana quick-toggle — hidden on very small mobile, shown on sm+ */}
        <button
          onClick={() => setFuriganaHidden(h => !h)}
          className="hidden sm:flex items-center text-xs px-2.5 py-1.5 rounded whitespace-nowrap shrink-0 font-medium touch-manipulation"
          style={{ backgroundColor: ACCENT_DARK }}
          title={furiganaHidden ? 'Show furigana' : 'Hide furigana'}
        >
          {furiganaHidden ? 'Show ふ' : 'Hide ふ'}
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(o => !o)}
          className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-lg shrink-0 touch-manipulation hover:bg-white/10 active:bg-white/20 transition-colors"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${drawerOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${drawerOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${drawerOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </header>

      {/* ── Install banner ── */}
      {showBanner && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 text-sm border-b"
          style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
        >
          <span className="flex-1 text-green-800 text-xs leading-snug">
            Add to home screen for offline access
          </span>
          <button
            onClick={handleInstall}
            className="text-white text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 touch-manipulation"
            style={{ backgroundColor: ACCENT }}
          >
            Install
          </button>
          <button
            onClick={() => { setInstallDismissed(true); localStorage.setItem('install-dismissed', 'true'); }}
            className="text-green-600 text-xl leading-none w-7 h-7 flex items-center justify-center shrink-0 touch-manipulation"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <Outlet />
      </main>

      <footer
        className="text-center text-xs text-gray-500 py-4 border-t border-gray-200"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
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

      {/* ── Backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Bottom sheet drawer ── */}
      <div
        className="fixed left-0 right-0 z-50 transition-all duration-300 ease-out"
        style={{
          bottom: drawerOpen ? 0 : '-100%',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="bg-white rounded-t-2xl shadow-2xl">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="px-4 pt-2 pb-4">
            <h2 className="text-base font-bold text-gray-800 mb-4">Settings</h2>

            {/* Furigana toggle row */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">Furigana (ふりがな)</p>
                <p className="text-xs text-gray-500 mt-0.5">Show reading hints above kanji</p>
              </div>
              <button
                onClick={() => setFuriganaHidden(h => !h)}
                className="relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200 touch-manipulation focus:outline-none"
                style={{ backgroundColor: furiganaHidden ? '#d1d5db' : ACCENT }}
                role="switch"
                aria-checked={!furiganaHidden}
              >
                <span
                  className="inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5"
                  style={{ transform: furiganaHidden ? 'translateX(0)' : 'translateX(20px)' }}
                />
              </button>
            </div>

            {/* Install row (Android only) */}
            {installPrompt && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">Add to Home Screen</p>
                  <p className="text-xs text-gray-500 mt-0.5">Works offline after install</p>
                </div>
                <button
                  onClick={handleInstall}
                  className="text-white text-xs px-4 py-2 rounded-full font-semibold touch-manipulation"
                  style={{ backgroundColor: ACCENT }}
                >
                  Install
                </button>
              </div>
            )}

            {/* iOS tip if not already installed */}
            {!installPrompt && !window.matchMedia('(display-mode: standalone)').matches && (
              <div className="py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">Add to Home Screen</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  On iOS: tap <strong>Share</strong> → <strong>Add to Home Screen</strong> for offline access.
                </p>
              </div>
            )}

            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl touch-manipulation hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
