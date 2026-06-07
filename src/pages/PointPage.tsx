import { useParams, Link } from 'react-router-dom';
import { getById, allPoints } from '../lib/data';
import { stripTitlePlain } from '../lib/title';
import PointCard from '../components/PointCard';

export default function PointPage() {
  const { id } = useParams<{ id: string }>();
  const point = id ? getById(id) : undefined;

  const idx = point ? allPoints.findIndex(p => p.id === id) : -1;
  const prev = idx > 0 ? allPoints[idx - 1] : undefined;
  const next = idx >= 0 && idx < allPoints.length - 1 ? allPoints[idx + 1] : undefined;

  if (!point) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--ink-soft)] mb-4">Grammar point not found: {id}</p>
        <Link to="/" className="underline underline-offset-2 text-[var(--brand-ink)]">Back to home</Link>
      </div>
    );
  }

  return (
    <div>
      <PointCard point={point} />

      {/* Prev / Next navigation */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            to={`/point/${prev.id}`}
            className="flex flex-col gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 hover:bg-[var(--hover)] active:bg-[var(--active)] transition-colors touch-manipulation min-h-[60px] justify-center"
          >
            <span className="text-xs text-[var(--ink-faint)]">← Previous</span>
            <span className="text-sm text-[var(--ink)] leading-snug line-clamp-2">{stripTitlePlain(prev.titlePlain)}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to={`/point/${next.id}`}
            className="flex flex-col gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 hover:bg-[var(--hover)] active:bg-[var(--active)] transition-colors touch-manipulation min-h-[60px] justify-center text-right"
          >
            <span className="text-xs text-[var(--ink-faint)]">Next →</span>
            <span className="text-sm text-[var(--ink)] leading-snug line-clamp-2">{stripTitlePlain(next.titlePlain)}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
