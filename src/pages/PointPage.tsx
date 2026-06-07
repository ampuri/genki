import { useParams, Link } from 'react-router-dom';
import { getById, allPoints } from '../lib/data';
import { stripTitlePlain } from '../lib/title';
import PointCard from '../components/PointCard';

const ACCENT = '#66BB55';

export default function PointPage() {
  const { id } = useParams<{ id: string }>();
  const point = id ? getById(id) : undefined;

  const idx = point ? allPoints.findIndex(p => p.id === id) : -1;
  const prev = idx > 0 ? allPoints[idx - 1] : undefined;
  const next = idx >= 0 && idx < allPoints.length - 1 ? allPoints[idx + 1] : undefined;

  if (!point) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Grammar point not found: {id}</p>
        <Link to="/" className="underline" style={{ color: ACCENT }}>Back to home</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <div className="mb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm hover:underline touch-manipulation"
          style={{ color: ACCENT }}
        >
          <span>←</span>
          <span>All Grammar Points</span>
        </Link>
      </div>

      <PointCard point={point} />

      {/* Prev / Next navigation */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            to={`/point/${prev.id}`}
            className="flex flex-col gap-0.5 border border-gray-200 rounded-xl px-3 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-h-[60px] justify-center"
          >
            <span className="text-xs text-gray-400">← Previous</span>
            <span className="text-sm text-gray-700 leading-snug line-clamp-2">{stripTitlePlain(prev.titlePlain)}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to={`/point/${next.id}`}
            className="flex flex-col gap-0.5 border border-gray-200 rounded-xl px-3 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-h-[60px] justify-center text-right"
          >
            <span className="text-xs text-gray-400">Next →</span>
            <span className="text-sm text-gray-700 leading-snug line-clamp-2">{stripTitlePlain(next.titlePlain)}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
