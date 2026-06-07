import { Link } from 'react-router-dom';
import { getLessonGroups } from '../lib/data';
import { Html } from '../lib/ruby';

const GENKI1 = '#FF9933';
const GENKI2 = '#66BB55';
const lessonGroups = getLessonGroups();

export default function LessonToc() {
  const genkiI = lessonGroups.filter(g => g.book === 'Genki I');
  const genkiII = lessonGroups.filter(g => g.book === 'Genki II');

  return (
    <div className="space-y-8">
      <BookSection title="Genki I" groups={genkiI} accent={GENKI1} />
      <BookSection title="Genki II" groups={genkiII} accent={GENKI2} />
    </div>
  );
}

function BookSection({ title, groups, accent }: { title: string; groups: typeof lessonGroups; accent: string }) {
  return (
    <section>
      <h2
        className="text-xl font-bold mb-3 pb-1"
        style={{ color: accent, borderBottom: `2px solid ${accent}` }}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.lesson}>
            <h3 className="font-semibold text-gray-600 text-sm mb-1">
              Lesson {g.lesson}: {g.title}
            </h3>
            <ul>
              {g.points.map(pt => (
                <li key={pt.id}>
                  <Link
                    to={`/point/${pt.id}`}
                    className="flex items-baseline gap-2 rounded px-2 py-0.5 group hover:bg-gray-100"
                  >
                    <span className="text-gray-400 text-xs w-12 shrink-0">
                      {pt.isExpressionNote ? '表現' : `L${pt.lesson}`}
                    </span>
                    <span className="group-hover:underline" style={{ color: accent }}>
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
