import { Html } from '../lib/ruby';
import { stripTitleHtml, stripHonbunDialogue } from '../lib/title';
import { accentVar, accentSoftVar } from '../lib/accent';
import type { GrammarPoint } from '../types';

interface Props {
  point: GrammarPoint;
}

/** A labeled section: Japanese label + furigana, English gloss, then body. */
function Section({
  jp, rt, en, children,
}: {
  jp: string; rt: string; en: string; children: React.ReactNode;
}) {
  return (
    <section className="pt-section">
      <div className="pt-head">
        <span className="jp"><ruby>{jp}<rt>{rt}</rt></ruby></span>
        <span className="en">{en}</span>
      </div>
      {children}
    </section>
  );
}

export default function PointCard({ point }: Props) {
  const accent = accentVar(point);

  return (
    <article style={{ '--accent': accent } as React.CSSProperties}>
      {/* Kicker */}
      <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[var(--ink-faint)] mb-1.5">
        {point.book} · Lesson {point.lesson}
        {point.isExpressionNote && ' · 表現ノート'}
      </p>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-2xl font-bold leading-snug" style={{ color: accent }}>
          <Html html={stripTitleHtml(point.title)} />
        </h1>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 self-start mt-1"
          style={{ color: accent, backgroundColor: accentSoftVar(point) }}
        >
          {point.page}
        </span>
      </div>

      {point.honbun.length > 0 && (
        <Section jp="本文" rt="ほんぶん" en="Dialogue">
          <div className="cell">
            <ul>
              {point.honbun.map((h, i) => (
                <li key={i}>
                  <Html html={stripHonbunDialogue(h.text)} />
                  {h.ref && <><br /><span className="text-[var(--ink-faint)] text-sm"><Html html={h.ref} /></span></>}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {point.explanation && (
        <Section jp="説明" rt="せつめい" en="Explanation">
          <div className="cell"><Html html={point.explanation} /></div>
        </Section>
      )}

      {point.patterns.length > 0 && (
        <Section jp="文型" rt="ぶんけい" en="Pattern">
          <ul className="pattern-list">
            {point.patterns.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Section>
      )}

      {point.englishEquivalent && (
        <Section jp="英訳" rt="えいやく" en="English">
          <div className="cell"><Html html={point.englishEquivalent} /></div>
        </Section>
      )}

      {point.examples.length > 0 && (
        <Section jp="例文" rt="れいぶん" en="Examples">
          <ol className="ex-list">
            {point.examples.map((ex, i) => (
              <li key={i}>
                <div className="ex-jp"><Html html={ex.jp} /></div>
                {ex.en && <div className="ex-en">{ex.en}</div>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {point.supplemental.length > 0 && (
        <Section jp="補足" rt="ほそく" en="Supplement">
          <div className="cell">
            {point.supplemental.map((sg, i) => (
              <div key={i} className="sup-group">
                <div className="label">{sg.label}</div>
                <ul>
                  {sg.links.map((lk, j) => (
                    <li key={j}>
                      <a
                        href={lk.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ color: accent }}
                      >
                        {lk.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
