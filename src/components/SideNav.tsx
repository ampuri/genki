import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getLessonGroups } from '../lib/data';
import { Html } from '../lib/ruby';
import { stripTitleHtml } from '../lib/title';

const ACCENT = '#66BB55';
const ACCENT_DARK = '#5A9944';
const EXPR_COLOR = '#3CAEA3';

const lessonGroups = getLessonGroups();
const genkiI = lessonGroups.filter(g => g.book === 'Genki I');
const genkiII = lessonGroups.filter(g => g.book === 'Genki II');

interface Props {
  currentPointId?: string;
  isOpen: boolean;
  furiganaHidden: boolean;
  onToggleFurigana: () => void;
  onClose: () => void;
}

export default function SideNav({ currentPointId, isOpen, furiganaHidden, onToggleFurigana, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && currentPointId && scrollRef.current) {
      const el = scrollRef.current.querySelector<HTMLElement>(`[data-point-id="${currentPointId}"]`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
      }
    }
  }, [isOpen, currentPointId]);

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl">
      {/* Panel header */}
      <div
        className="flex items-center justify-between gap-3 px-4 shrink-0 text-white"
        style={{
          backgroundColor: ACCENT,
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: '0.75rem',
        }}
      >
        <Link to="/" onClick={onClose} className="font-bold text-sm hover:opacity-90 flex-1 min-w-0 leading-tight">
          文法 Reference
        </Link>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 touch-manipulation shrink-0"
          aria-label="Close menu"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>
      </div>

      {/* Scrollable lesson list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <BookSection title="Genki I" groups={genkiI} currentPointId={currentPointId} onClose={onClose} />
        <BookSection title="Genki II" groups={genkiII} currentPointId={currentPointId} onClose={onClose} />
      </div>

      {/* Sticky settings */}
      <div
        className="border-t border-gray-200 px-4 py-3 shrink-0 bg-white"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">Furigana</p>
            <p className="text-xs text-gray-500">Show readings above kanji</p>
          </div>
          <button
            onClick={onToggleFurigana}
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
      </div>
    </div>
  );
}

function BookSection({
  title,
  groups,
  currentPointId,
  onClose,
}: {
  title: string;
  groups: typeof lessonGroups;
  currentPointId?: string;
  onClose: () => void;
}) {
  return (
    <div>
      <div
        className="px-3 py-2 text-xs font-bold uppercase tracking-wider sticky top-0 bg-white border-b border-gray-100"
        style={{ color: ACCENT_DARK }}
      >
        {title}
      </div>
      {groups.map(group => (
        <div key={group.lesson}>
          <div className="px-3 pt-2.5 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            L{group.lesson}: {group.title}
          </div>
          {group.points.map(pt => {
            const isActive = pt.id === currentPointId;
            const color = pt.isExpressionNote ? EXPR_COLOR : ACCENT;
            return (
              <Link
                key={pt.id}
                to={`/point/${pt.id}`}
                onClick={onClose}
                data-point-id={pt.id}
                className="flex items-center min-h-[44px] px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                style={{
                  color: isActive ? color : pt.isExpressionNote ? '#5a9e99' : '#4a8c3f',
                  backgroundColor: isActive
                    ? pt.isExpressionNote ? '#f0fbfa' : '#f0fdf4'
                    : undefined,
                  borderLeft: `3px solid ${isActive ? color : 'transparent'}`,
                }}
              >
                <Html html={stripTitleHtml(pt.title)} />
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
