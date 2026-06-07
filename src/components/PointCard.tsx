import { Html } from '../lib/ruby';
import type { GrammarPoint } from '../types';

interface Props {
  point: GrammarPoint;
}

export default function PointCard({ point }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          <Html html={point.title} />
        </h1>
        <div className="flex gap-2 mt-1 flex-wrap text-sm">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
            {point.book}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
            Lesson {point.lesson}
          </span>
          <span className="text-gray-500">p. {point.page}</span>
          {point.isExpressionNote && (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              Expression Note
            </span>
          )}
        </div>
      </div>

      <table className="grammar-table w-full text-sm border border-gray-200 rounded">
        <tbody>
          {point.honbun.length > 0 && (
            <tr>
              <td className="font-medium">本文</td>
              <td>
                <ul className="space-y-1">
                  {point.honbun.map((h, i) => (
                    <li key={i}>
                      <Html html={h.text} />
                      {h.ref && <span className="text-gray-400 ml-1 text-xs">{h.ref}</span>}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}

          {point.explanation && (
            <tr>
              <td className="font-medium">説明</td>
              <td><Html html={point.explanation} /></td>
            </tr>
          )}

          {point.englishEquivalent && (
            <tr>
              <td className="font-medium">英訳</td>
              <td><Html html={point.englishEquivalent} /></td>
            </tr>
          )}

          {point.patterns.length > 0 && (
            <tr>
              <td className="font-medium">文型</td>
              <td>
                <ul className="space-y-0.5">
                  {point.patterns.map((p, i) => (
                    <li key={i} className="font-mono text-indigo-800">{p}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}

          {point.examples.length > 0 && (
            <tr>
              <td className="font-medium">例文</td>
              <td>
                <ol className="list-decimal list-inside space-y-1">
                  {point.examples.map((ex, i) => (
                    <li key={i}>
                      <Html html={ex.jp} className="inline" />
                      <span className="text-gray-500 ml-2 text-xs">{ex.en}</span>
                    </li>
                  ))}
                </ol>
              </td>
            </tr>
          )}

          {point.supplemental.length > 0 && (
            <tr>
              <td className="font-medium">補足</td>
              <td>
                <div className="space-y-2">
                  {point.supplemental.map((sg, i) => (
                    <div key={i}>
                      <div className="font-semibold text-xs text-gray-600 mb-0.5">{sg.label}</div>
                      <ul className="space-y-0.5">
                        {sg.links.map((lk, j) => (
                          <li key={j}>
                            <a
                              href={lk.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 underline"
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

          {point.practice.length > 0 && (
            <tr>
              <td className="font-medium">練習</td>
              <td>
                <ul className="space-y-0.5">
                  {point.practice.map((lk, i) => (
                    <li key={i}>
                      <a
                        href={lk.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline"
                      >
                        {lk.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
