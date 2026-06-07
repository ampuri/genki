import { useParams, Link } from 'react-router-dom';
import { getById } from '../lib/data';
import PointCard from '../components/PointCard';

export default function PointPage() {
  const { id } = useParams<{ id: string }>();
  const point = id ? getById(id) : undefined;

  if (!point) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Grammar point not found: {id}</p>
        <Link to="/" className="text-indigo-600 underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">← All Grammar Points</Link>
      </div>
      <PointCard point={point} />
    </div>
  );
}
