import { Link } from 'react-router-dom';
import { getLessonGroups } from '../lib/data';
import { Html } from '../lib/ruby';
import { stripTitleHtml } from '../lib/title';
import { accentVar, bookColorVar } from '../lib/accent';

const lessonGroups = getLessonGroups();

export default function LessonToc({ view }: { view?: string | null }) {
  const filtered = view
    ? lessonGroups
        .map(g => ({ ...g, points: g.points.filter(p => p.views.includes(view)) }))
        .filter(g => g.points.length > 0)
    : lessonGroups;

  const genkiI = filtered.filter(g => g.book === 'Genki I');
  const genkiII = filtered.filter(g => g.book === 'Genki II');

  if (filtered.length === 0) {
    return (
      <p className="text-center text-[var(--ink-soft)] py-12">No grammar points in this view.</p>
    );
  }

  return (
    <div className="space-y-9">
      {genkiI.length > 0 && <BookSection title="Genki I" groups={genkiI} />}
      {genkiII.length > 0 && <BookSection title="Genki II" groups={genkiII} />}
    </div>
  );
}

function BookSection({ title, groups }: { title: string; groups: typeof lessonGroups }) {
  const bookColor = bookColorVar(title as 'Genki I' | 'Genki II');

  return (
    <section>
      <header className="flex items-center gap-2.5 mb-4 px-0.5">
        <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: bookColor }} />
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--ink)]">{title}</h2>
      </header>

      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.lesson} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <h3 className="px-4 py-2 text-xs font-bold tracking-wide bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--ink-soft)]">
              Lesson {g.lesson}
            </h3>
            <ul>
              {g.points.map((pt, i) => (
                <li key={pt.id} className={i > 0 ? 'border-t border-[var(--border)]' : ''}>
                  <Link
                    to={`/point/${pt.id}`}
                    className="group flex items-center gap-3 min-h-[52px] pl-4 pr-3 py-2 transition-colors hover:bg-[var(--hover)] active:bg-[var(--active)]"
                    style={pt.isExpressionNote ? undefined : { boxShadow: `inset 4px 0 0 ${accentVar(pt)}` }}
                  >
                    <span className="flex-1 leading-snug text-[var(--ink)]">
                      <Html html={stripTitleHtml(pt.title)} />
                    </span>
                    <svg
                      className="shrink-0 text-[var(--ink-faint)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
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
