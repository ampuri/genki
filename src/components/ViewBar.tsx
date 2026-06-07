import { useEffect, useMemo, useState } from 'react';
import { VIEW_FAMILIES, getView } from '../lib/views';
import { allPoints } from '../lib/data';

interface Props {
  activeView: string | null;
  onChange: (id: string | null) => void;
}

export default function ViewBar({ activeView, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // count tagged points per view id once
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of allPoints) for (const v of p.views) c[v] = (c[v] ?? 0) + 1;
    return c;
  }, []);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const active = activeView ? getView(activeView) : undefined;

  return (
    <>
      {active ? (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] text-white pl-3 pr-1 py-1.5 text-sm font-semibold shadow-sm">
          <ViewIcon className="opacity-90" />
          <span>{active.label}</span>
          <button
            onClick={() => onChange(null)}
            className="ml-0.5 w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/20 active:bg-white/30 touch-manipulation text-lg leading-none"
            aria-label="Clear view"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink-soft)] px-3 py-1.5 text-sm font-semibold hover:bg-[var(--hover)] active:bg-[var(--active)] touch-manipulation transition-colors"
        >
          <ViewIcon className="text-[var(--brand)]" />
          <span>Views</span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Choose a view"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full sm:max-w-lg max-h-[85vh] flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
              <h2 className="text-base font-extrabold tracking-tight text-[var(--ink)]">Preset views</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--hover)] touch-manipulation text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="overflow-y-auto px-4 py-3 space-y-5">
              {VIEW_FAMILIES.map(fam => (
                <section key={fam.name}>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)] mb-2">
                    {fam.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fam.views.map(v => {
                      const n = counts[v.id] ?? 0;
                      const isActive = v.id === activeView;
                      return (
                        <button
                          key={v.id}
                          disabled={n === 0}
                          onClick={() => {
                            onChange(v.id);
                            setOpen(false);
                          }}
                          className={[
                            'text-left rounded-xl border px-3 py-2.5 transition-colors touch-manipulation',
                            isActive
                              ? 'border-[var(--brand)] bg-[var(--brand)]/10'
                              : 'border-[var(--border)] hover:bg-[var(--hover)] active:bg-[var(--active)]',
                            n === 0 ? 'opacity-40 cursor-not-allowed' : '',
                          ].join(' ')}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[var(--ink)] leading-snug">{v.label}</span>
                            <span className="shrink-0 text-xs font-bold text-[var(--ink-faint)] tabular-nums">{n}</span>
                          </div>
                          <p className="text-xs text-[var(--ink-soft)] leading-snug mt-0.5">{v.blurb}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ViewIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
