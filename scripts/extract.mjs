import { load } from 'cheerio';
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('data/source/grammar-index.html', 'utf8');
const $ = load(html);

const LIVE = 'https://sethclydesdale.github.io/genki-study-resources/lessons-3rd/';
const ALLOWED_TAGS = new Set(['ruby', 'rt', 'strong', 'em', 'br', 'ul', 'ol', 'li', 'a', 'div', 'span']);

function stripMarkup(html) {
  if (!html) return '';
  // Remove <rt>...</rt> first (furigana readings)
  let s = html.replace(/<rt[^>]*>[\s\S]*?<\/rt>/gi, '');
  // Remove all remaining tags
  s = s.replace(/<[^>]+>/g, '');
  // Decode basic HTML entities
  s = s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#[\d]+;/g, '');
  return s.trim();
}

function sanitize($el) {
  // Clone and sanitize HTML to allowed tags only
  const clone = $el.clone();
  clone.find('*').each((_, el) => {
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (!ALLOWED_TAGS.has(tag)) {
      $(el).replaceWith($(el).html() || '');
    }
  });
  return clone.html() || '';
}

// Parse the 補足 (supplemental) cell
function parseSupplemental($td) {
  const groups = [];
  let currentLabel = null;
  let currentLinks = [];

  $td.contents().each((_, node) => {
    if (node.type === 'tag') {
      const tag = node.tagName.toLowerCase();
      if (tag === 'strong') {
        if (currentLabel !== null) {
          groups.push({ label: currentLabel, links: currentLinks });
        }
        currentLabel = $(node).text().trim();
        currentLinks = [];
      } else if (tag === 'ul' || tag === 'ol') {
        $(node).find('a').each((_, a) => {
          const href = $(a).attr('href') || '';
          const text = $(a).text().trim();
          if (text) currentLinks.push({ text, href });
        });
      }
    }
  });

  if (currentLabel !== null) {
    groups.push({ label: currentLabel, links: currentLinks });
  }

  return groups;
}

// Parse 本文 (honbun) cell - list of dialogue excerpts
function parseHonbun($td) {
  const items = [];
  $td.find('li').each((_, li) => {
    const html = $(li).html() || '';
    // Split on <br> to separate JP from EN ref
    const parts = html.split(/<br\s*\/?>/i);
    const text = parts[0] ? sanitize($(load('<span>' + parts[0] + '</span>')('span'))) : '';
    const ref = parts[1] ? stripMarkup(parts[1]).trim() : undefined;
    if (text) items.push({ text, ref: ref || undefined });
  });
  return items;
}

// Parse 例文 (examples)
function parseExamples($td) {
  const examples = [];
  $td.find('li').each((_, li) => {
    const $cols = $(li).find('.example');
    if ($cols.length >= 2) {
      examples.push({
        jp: sanitize($cols.eq(0)),
        en: $cols.eq(1).text().trim(),
      });
    }
  });
  return examples;
}

// Rewrite relative ../../lesson-x/... URLs to absolute
function rewritePracticeLinks($td) {
  const links = [];
  $td.find('a').each((_, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().trim();
    // relative href: ../../lesson-x/grammar-y/ -> https://...lessons-3rd/lesson-x/grammar-y/
    const abs = href.replace(/^\.\.\/\.\.\//, LIVE);
    if (text) links.push({ text, href: abs });
  });
  return links;
}

// Build lesson title map from <h2 id="lesson-grammar-N">
const lessonTitles = {};
$('h2.lesson-title[id^="lesson-grammar-"]').each((_, h2) => {
  const id = $(h2).attr('id') || '';
  const m = id.match(/lesson-grammar-(\d+)/);
  if (!m) return;
  const lesson = +m[1];
  // Remove page-data span, extract just the lesson name
  const $h2 = $(h2).clone();
  $h2.find('.page-data').remove();
  const text = $h2.text().trim();
  // text like "Lesson 1: New Friends (...)"
  const titleMatch = text.match(/Lesson \d+:\s*(.+)/);
  lessonTitles[lesson] = titleMatch ? titleMatch[1].trim() : text;
});

const points = [];

$('h3.workbook-title[id^="l"]').each((_, h3) => {
  const $h3 = $(h3);
  const id = $h3.attr('id') || '';
  // Match both l1-p1 and l0-p01 style ids
  const m = id.match(/^l(\d+)-p(\d+)$/);
  if (!m) return;

  const lesson = +m[1];
  const pNum = m[2];
  const isExpressionNote = /^0\d+$/.test(pNum);
  const order = isExpressionNote ? 1000 + parseInt(pNum, 10) : parseInt(pNum, 10);

  const $pageData = $h3.find('.page-data');
  const page = $pageData.text().trim().replace(/^(Genki I|Genki II):\s*/, '');
  const book = $pageData.text().includes('Genki II') ? 'Genki II' : 'Genki I';

  // title = h3 inner HTML minus the .page-data span
  const $titleClone = $h3.clone();
  $titleClone.find('.page-data').remove();
  const titleHtml = ($titleClone.html() || '').trim();
  const title = sanitize($titleClone);
  const titlePlain = stripMarkup(titleHtml);
  const keywords = ($h3.attr('data-keywords') || '').split('、').map(s => s.trim()).filter(Boolean);

  const $table = $h3.next('table.grammar-table');

  // Find a row by its Japanese label (first td text contains the label)
  const findRow = (label) => {
    let found = null;
    $table.find('tr').each((_, tr) => {
      const firstTdText = $(tr).find('td').first().text();
      if (firstTdText.includes(label)) {
        found = $(tr).find('td').eq(1);
        return false; // break
      }
    });
    return found;
  };

  const $honbunTd = findRow('本文');
  const honbun = $honbunTd ? parseHonbun($honbunTd) : [];

  const $setteiTd = findRow('説明');
  const explanation = $setteiTd ? sanitize($setteiTd) : '';

  const $hososokuTd = findRow('補足');
  const supplemental = $hososokuTd ? parseSupplemental($hososokuTd) : [];

  const $eiyakuTd = findRow('英訳');
  const englishEquivalent = $eiyakuTd ? sanitize($eiyakuTd) : '';

  const $bunkeiTd = findRow('文型');
  let patterns = [];
  if ($bunkeiTd) {
    const bunkeiHtml = $bunkeiTd.html() || '';
    patterns = bunkeiHtml.split(/<br\s*\/?>/i)
      .map(s => stripMarkup(s).replace(/^[a-z]\.\s+/, '').trim())
      .filter(Boolean);
  }

  const $reibunTd = findRow('例文');
  const examples = $reibunTd ? parseExamples($reibunTd) : [];

  const $renshuTd = findRow('練習');
  const practice = $renshuTd ? rewritePracticeLinks($renshuTd) : [];

  // Build searchBlob: lowercase everything for search
  const searchBlob = [
    titlePlain,
    ...keywords,
    stripMarkup(explanation),
    ...examples.flatMap(e => [stripMarkup(e.jp), e.en]),
    ...patterns,
    englishEquivalent ? stripMarkup(englishEquivalent) : '',
  ].join(' ').toLowerCase();

  points.push({
    id,
    lesson,
    order,
    isExpressionNote,
    title,
    titlePlain,
    book,
    page,
    keywords,
    honbun,
    explanation,
    supplemental,
    englishEquivalent,
    patterns,
    examples,
    practice,
    searchBlob,
  });
});

if (points.length < 190) {
  throw new Error(`Only parsed ${points.length} grammar points — expected ~198`);
}

console.log(`Extracted ${points.length} grammar points.`);

// Spot-check
const p1 = points.find(p => p.id === 'l1-p1');
if (!p1) throw new Error('Missing l1-p1');
if (p1.examples.length < 6) throw new Error(`l1-p1 has only ${p1.examples.length} examples`);

const p0 = points.find(p => p.id === 'l0-p01');
if (!p0) throw new Error('Missing l0-p01');
if (!p0.isExpressionNote) throw new Error('l0-p01 should be an expression note');

const p13 = points.find(p => p.id === 'l13-p1');
if (!p13) throw new Error('Missing l13-p1');
if (p13.book !== 'Genki II') throw new Error(`l13-p1 book is ${p13.book}, expected Genki II`);

console.log('Spot checks passed. Writing grammar.json...');
writeFileSync('src/data/grammar.json', JSON.stringify(points, null, 2));
console.log('Done: src/data/grammar.json');
