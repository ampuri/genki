import { Link } from 'react-router-dom';
import { getLessonGroups } from '../lib/data';
import { Html } from '../lib/ruby';
import { stripTitleHtml } from '../lib/title';

const ACCENT = '#66BB55';
const EXPR_COLOR = '#3CAEA3';
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
      <h2
        className="text-xl font-bold mb-3 pb-1"
        style={{ color: ACCENT, borderBottom: `2px solid ${ACCENT}` }}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.lesson}>
            <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1 px-2">
              Lesson {g.lesson}: {g.title}
            </h3>
            <ul>
              {g.points.map(pt => {
                const color = pt.isExpressionNote ? EXPR_COLOR : ACCENT;
                return (
                  <li key={pt.id}>
                    <Link
                      to={`/point/${pt.id}`}
                      className="flex items-center gap-2 rounded-lg px-2 min-h-[44px] group hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="group-hover:underline flex-1 leading-snug py-0.5" style={{ color }}>
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
    </section>
  );
}
