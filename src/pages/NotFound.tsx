import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-[var(--ink)] mb-4">404</h1>
      <p className="text-[var(--ink-soft)] mb-6">Page not found.</p>
      <Link to="/" className="underline underline-offset-2 text-[var(--brand-ink)]">Back to Grammar Index</Link>
    </div>
  );
}
