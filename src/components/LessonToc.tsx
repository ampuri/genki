import { Link } from 'react-router-dom';
import { getLessonGroups } from '../lib/data';
import { Html } from '../lib/ruby';

const lessonGroups = getLessonGroups();

export default function LessonToc() {
  const genkiI = lessonGroups.filter(g => g.book === 'Genki I');
  const genkiII = lessonGroups.filter(g => g.book === 'Genki II');

  return (
    <div className="space-y-8">
      <BookSection title="Genki I" groups={genkiI} />
      <BookSection title="Genki II" groups={genkiII} />
    </div>
  );
}

function BookSection({ title, groups }: { title: string; groups: typeof lessonGroups }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-indigo-800 mb-3 pb-1 border-b border-indigo-200">{title}</h2>
      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.lesson}>
            <h3 className="font-semibold text-gray-700 text-sm mb-1">
              Lesson {g.lesson}: {g.title}
            </h3>
            <ul className="space-y-1">
              {g.points.map(pt => (
                <li key={pt.id}>
                  <Link
                    to={`/point/${pt.id}`}
                    className="flex items-baseline gap-2 hover:bg-indigo-50 rounded px-2 py-0.5 group"
                  >
                    <span className="text-gray-400 text-xs w-12 shrink-0">
                      {pt.isExpressionNote ? '表現' : `L${pt.lesson}`}
                    </span>
                    <span className="text-indigo-700 group-hover:underline">
                      <Html html={pt.title} />
                    </span>
                    <span className="text-gray-400 text-xs ml-auto">{pt.page}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
