import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getLessonGroups } from '../lib/data';
import { Html } from '../lib/ruby';
import { stripTitleHtml } from '../lib/title';
import { accentVar, accentSoftVar, bookColorVar } from '../lib/accent';

const lessonGroups = getLessonGroups();
const genkiI = lessonGroups.filter(g => g.book === 'Genki I');
const genkiII = lessonGroups.filter(g => g.book === 'Genki II');

interface Props {
  currentPointId?: string;
  isOpen: boolean;
  furiganaHidden: boolean;
  onToggleFurigana: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onClose: () => void;
}

export default function SideNav({
  currentPointId, isOpen, furiganaHidden, onToggleFurigana, theme, onToggleTheme, onClose,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Snap the active point into view the instant the drawer opens (no animation).
  useEffect(() => {
    if (!isOpen || !currentPointId || !scrollRef.current) return;
    const container = scrollRef.current;
    const el = container.querySelector<HTMLElement>(`[data-point-id="${currentPointId}"]`);
    if (el) {
      container.scrollTop = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    }
  }, [isOpen, currentPointId]);

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] shadow-2xl">
      {/* Panel header */}
      <div
        className="flex items-center justify-between gap-3 px-4 shrink-0 bg-[var(--header-bg)] text-[var(--header-ink)] border-b border-[var(--header-border)]"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: '0.75rem',
        }}
      >
        <Link to="/" onClick={onClose} className="font-bold text-sm hover:opacity-90 flex-1 min-w-0 leading-tight">
          文法 Reference
        </Link>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20 touch-manipulation shrink-0"
          aria-label="Close menu"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>
      </div>

      {/* Scrollable lesson list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <BookSection title="Genki I" groups={genkiI} currentPointId={currentPointId} onClose={onClose} />
        <BookSection title="Genki II" groups={genkiII} currentPointId={currentPointId} onClose={onClose} />
      </div>

      {/* Sticky settings */}
      <div
        className="border-t border-[var(--border)] px-4 py-2 shrink-0 bg-[var(--surface)]"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <ToggleRow title="Furigana" sub="Readings above kanji" on={!furiganaHidden} onToggle={onToggleFurigana} />
        <div className="h-px bg-[var(--border)]" />
        <ToggleRow title="Dark mode" sub="Easier on the eyes" on={theme === 'dark'} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}

function ToggleRow({ title, sub, on, onToggle }: {
  title: string; sub: string; on: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
        <p className="text-xs text-[var(--ink-faint)]">{sub}</p>
      </div>
      <button
        onClick={onToggle}
        className="relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200 touch-manipulation focus:outline-none"
        style={{ backgroundColor: on ? 'var(--brand)' : 'var(--border-strong)' }}
        role="switch"
        aria-checked={on}
        aria-label={title}
      >
        <span
          className="inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5"
          style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

function BookSection({
  title, groups, currentPointId, onClose,
}: {
  title: string;
  groups: typeof lessonGroups;
  currentPointId?: string;
  onClose: () => void;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 px-1 mb-2.5">
        <span className="w-1 h-4 rounded-full" style={{ backgroundColor: bookColorVar(title as 'Genki I' | 'Genki II') }} />
        <span className="text-base font-extrabold tracking-tight text-[var(--ink)]">{title}</span>
      </h2>
      <div className="space-y-3">
        {groups.map(group => (
          <div key={group.lesson} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-3 py-1.5 text-[11px] font-bold tracking-wide bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--ink-soft)]">
              Lesson {group.lesson}
            </div>
            <ul>
              {group.points.map((pt, i) => {
                const isActive = pt.id === currentPointId;
                const accent = accentVar(pt);
                return (
                  <li key={pt.id} className={i > 0 ? 'border-t border-[var(--border)]' : ''}>
                    <Link
                      to={`/point/${pt.id}`}
                      replace={!!currentPointId}
                      onClick={onClose}
                      data-point-id={pt.id}
                      className="flex items-center min-h-[44px] pl-3 pr-2 py-1.5 text-sm transition-colors hover:bg-[var(--hover)] active:bg-[var(--active)]"
                      style={{
                        boxShadow: pt.isExpressionNote ? undefined : `inset 4px 0 0 ${accent}`,
                        backgroundColor: isActive ? accentSoftVar(pt) : undefined,
                      }}
                    >
                      <span
                        className="flex-1 leading-snug"
                        style={{ color: isActive ? accent : 'var(--ink)', fontWeight: isActive ? 600 : 400 }}
                      >
                        <Html html={stripTitleHtml(pt.title)} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
