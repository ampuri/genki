import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Page not found.</p>
      <Link to="/" className="text-indigo-600 underline">Back to Grammar Index</Link>
    </div>
  );
}
