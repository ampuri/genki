import { useParams, Link } from 'react-router-dom';
import { getById, allPoints } from '../lib/data';
import PointCard from '../components/PointCard';

const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

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
        <Link to="/" className="text-indigo-600 underline">Back to home</Link>
      </div>
    );
  }

  const accent = point.book === 'Genki II' ? '#66BB55' : '#FF9933';

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${point.titlePlain} — Genki Grammar`,
        text: `Genki ${point.book === 'Genki II' ? 'II' : 'I'} ${point.page}: ${point.titlePlain}`,
        url: window.location.href,
      });
    } catch {
      // User cancelled or share unsupported — ignore
    }
  };

  return (
    <div>
      {/* Back + Share row */}
      <div className="mb-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm hover:underline touch-manipulation"
          style={{ color: accent }}
        >
          <span>←</span>
          <span>All Grammar Points</span>
        </Link>

        {canShare && (
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border touch-manipulation hover:bg-gray-50 active:bg-gray-100 transition-colors"
            style={{ borderColor: accent, color: accent }}
            title="Share this grammar point"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        )}
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
            <span className="text-sm text-gray-700 leading-snug line-clamp-2">{prev.titlePlain}</span>
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
            <span className="text-sm text-gray-700 leading-snug line-clamp-2">{next.titlePlain}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
