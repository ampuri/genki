import { Html } from '../lib/ruby';
import { stripTitleHtml, stripHonbunDialogue } from '../lib/title';
import type { GrammarPoint } from '../types';

const ACCENT = '#66BB55';
const EXPR_COLOR = '#3CAEA3';

interface Props {
  point: GrammarPoint;
}

export default function PointCard({ point }: Props) {
  const accent = point.isExpressionNote ? EXPR_COLOR : ACCENT;

  return (
    <div style={{ '--accent': accent } as React.CSSProperties}>
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="text-xl font-bold leading-snug" style={{ color: accent }}>
          <Html html={stripTitleHtml(point.title)} />
        </h1>
        <span
          className="text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 self-center"
          style={{ backgroundColor: accent }}
        >
          {point.book}: {point.page}
        </span>
      </div>

      {/* Grammar rows table */}
      <table className="grammar-table">
        <tbody>
          {point.honbun.length > 0 && (
            <tr>
              <td><ruby>本文<rt>ほんぶん</rt></ruby></td>
              <td>
                <ul>
                  {point.honbun.map((h, i) => (
                    <li key={i}>
                      <Html html={stripHonbunDialogue(h.text)} />
                      {h.ref && <><br /><Html html={h.ref} /></>}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}

          {point.explanation && (
            <tr>
              <td><ruby>説明<rt>せつめい</rt></ruby></td>
              <td><Html html={point.explanation} /></td>
            </tr>
          )}

          {point.supplemental.length > 0 && (
            <tr className="sup-list">
              <td><ruby>補足<rt>ほそく</rt></ruby></td>
              <td>
                <div>
                  {point.supplemental.map((sg, i) => (
                    <div key={i} style={{ marginBottom: '6px' }}>
                      <div className="font-bold text-sm" style={{ color: accent }}>{sg.label}</div>
                      <ul>
                        {sg.links.map((lk, j) => (
                          <li key={j}>
                            <a
                              href={lk.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: accent }}
                              className="underline"
                            >
                              {lk.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          )}

          {point.englishEquivalent && (
            <tr>
              <td><ruby>英訳<rt>えいやく</rt></ruby></td>
              <td><Html html={point.englishEquivalent} /></td>
            </tr>
          )}

          {point.patterns.length > 0 && (
            <tr>
              <td><ruby>文型<rt>ぶんけい</rt></ruby></td>
              <td>
                <ul>
                  {point.patterns.map((p, i) => (
                    <li key={i} style={{ color: accent }}>{p}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}

          {point.examples.length > 0 && (
            <tr>
              <td><ruby>例文<rt>れいぶん</rt></ruby></td>
              <td>
                <ol>
                  {point.examples.map((ex, i) => (
                    <li key={i}>
                      <div className="columns-2-in">
                        <div className="example"><Html html={ex.jp} /></div>
                        <div className="example">{ex.en}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
