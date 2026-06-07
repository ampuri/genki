// Tags every grammar point with preset-view ids based on its title.
// Run: node scripts/tag-views.mjs        (writes back to src/data/grammar.json)
//      node scripts/tag-views.mjs --dry  (report only, no write)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'src', 'data', 'grammar.json');
const points = JSON.parse(readFileSync(DATA, 'utf8'));

// High-precision regex per view, tested against titlePlain.
// Note: \b only works around ASCII; Japanese tokens are matched as literal substrings.
const rules = {
  // ── Parts of speech ──
  nouns: /\bnoun|はyです|じゃない|だれの|という|counting|counter|\bnumbers?\b|big numbers|qualifying nouns/i,
  verbs: /\bverbs?\b|conjugat|potential|passive|causative|transitiv|intransit|ている|てしまう|honorific verb|～する/i,
  adjectives: /\badjectiv|好き|きらい|忙しい|にぎやか|すぎる|adjective\+する|adjective\+なる|のような|のように|using adjectives|-stem\+さ/i,
  particles: /\bparticle|topic particle|subject particle|noun aや|には|～が\/～けど|～けど and|～まで/i,
  adverbs: /\badverb|frequency|たくさん|quantity|ちょっと|as adverbs/i,
  demonstratives: /これ／|この／|ここ／|あそこ|どこ|どれ/i,

  // ── Forms (form + things built on it) ──
  present: /present tense|long form|verb conjugation \(long/i,
  past: /past tense|past form/i,
  'te-form': /te-form|～て|てください|てもいい|てはいけ|ている|てから|てしまう|てある|ておく|てみる|てくる|てあげ|てくれ|てもら|ていただけ|てよかった|てすみません|てほしい/i,
  'short-form': /short form|んです|～ので|でしょう|みたいです|はず|つもり|～し$|と思|と言|～って|casual speech|informal speech|予定です/i,
  'verb-stem': /verb stem|stem \+|stem\+|～ながら|やすい|にくい|ましょう|^1\. ～たい|～方|に行く|すぎる|it looks like|-stem\+さ/i,
  negative: /ないで|なくても|なきゃ|なければ|ないです|negative|何も|しか|は\+negative|まだ～ていません/i,
  volitional: /volitional|～ておく/i,
  'advanced-verb': /potential|passive|causative|imperative|見える\/見られる|聞こえる\/聞ける/i,

  // ── Function / meaning ──
  requests: /てください|てもいい|てはいけ|ましょうか|ていただけ|ないでください|お～ください|respectful advice|ください|お願いします|どうぞ|たらどうですか|ませんか/i,
  obligation: /なければいけ|なきゃいけ|なくてもいい|ほうがいい/i,
  'giving-receiving': /あげる|くれる|もらう|てあげる|てくれ|てもら|ていただけ|くれてありがとう|おごる|ごちそう/i,
  comparison: /comparison|の中で/i,
  desire: /^1\. ～たい|ほしい|つもり|volitional form \+ と思|予定です|夢/i,
  quoting: /と思|と言|～って|i hear|によると|questions within larger|というitem/i,
  conditionals: /～たら|～ば|^4\. ～と$|なら|ばよかった|たらどうですか|たら in polite/i,
  politeness: /honorific|humble|extra-modest|respectful|お～|ご～|informal speech|casual speech|お-|honorific forms|たら in polite|さん$|先生|referring to others|ちゃん|よね|～ないです$/i,
  reasons: /^6\. ～から|explanationから|～ので|～んです|おかげ|からです|それで\/そして/i,
};

// Per-id corrections applied after regex. add = force-add, remove = force-remove.
const overrides = {
  'l0-p02': { remove: ['conditionals'] },              // さようなら (なら false match)
  'l1-p2':  { add: ['particles'] },                    // Question Sentences か
  'l3-p01': { add: ['verbs'] },                         // 行く/来る
  'l3-p4':  { add: ['particles'] },                     // Time References (に)
  'l4-p1':  { add: ['verbs', 'particles'] },            // Xがあります／います
  'l4-p2':  { add: ['nouns'] },                         // Describing Where Things Are (position nouns)
  'l4-p3':  { add: ['nouns'] },                         // Past Tense of です (copula)
  'l4-p5':  { add: ['particles'] },                     // も
  'l4-p6':  { add: ['nouns'] },                         // ～時間 (counter)
  'l4-p8':  { add: ['particles'] },                     // と
  'l2-p5':  { add: ['particles'] },                     // Nounも
  'l2-p7':  { add: ['particles'] },                     // ～ね／～よ
  'l6-p1':  { add: ['verbs'] },                         // Te-form (verb form)
  'l6-p6':  { add: ['particles'] },                     // ～から
  'l7-p02': { add: ['verbs'] },                         // 知る/分かる
  'l7-p3':  { add: ['adjectives'] },                    // Describing People (adjectives + body parts)
  'l8-p02': { add: ['adjectives', 'adverbs'] },         // 遅い/遅く (adj vs adverbial)
  'l8-p1':  { add: ['verbs'] },                         // Short Forms
  'l8-p2':  { add: ['verbs'] },
  'l8-p3':  { add: ['verbs'] },
  'l8-p4':  { add: ['verbs'] },
  'l8-p6':  { add: ['nouns'] },                         // Verbのが好きです (nominalization)
  'l9-p1':  { add: ['verbs'] },
  'l9-p2':  { add: ['verbs'] },
  'l9-p3':  { add: ['verbs'] },
  'l9-p4':  { add: ['verbs'] },
  'l10-p7': { add: ['particles'] },                     // で
  'l11-p2': { add: ['verbs'] },                         // ～たり～たりする
  'l11-p3': { add: ['verbs'] },                         // ～ことがある
  'l11-p02':{ add: ['particles'] },                     // だけ
  'l11-p03':{ add: ['particles'] },                     // に
  'l13-p3': { add: ['adjectives'] },                    // ～そうです (looks like) attaches to adj-stem too
  'l14-p2': { add: ['short-form'] },                    // ～かもしれません
  'l14-p03':{ add: ['verbs', 'advanced-verb'] },        // できる (potential of する)
  'l15-p1': { add: ['verbs'] },                         // Volitional Form
  'l15-p2': { add: ['verbs'] },                         // Volitional + と思っています
  'l16-p3': { add: ['conditionals'] },                  // ～といい
  'l16-p4': { add: ['conditionals'] },                  // ～時 (when)
  'l17-p1': { add: ['short-form'] },                    // ～そうです (I hear) attaches to short form
  'l17-p4': { remove: ['requests'] },                   // ～なくてもいいです (not a request)
  'l22-p2': { remove: ['requests'] },                   // Causative + giving (not a request)
  'l23-p3': { add: ['verbs'] },                         // ～ことにする
};

const report = [];
for (const p of points) {
  const t = p.titlePlain;
  const set = new Set();
  for (const [id, re] of Object.entries(rules)) {
    if (re.test(t)) set.add(id);
  }
  const ov = overrides[p.id];
  if (ov) {
    (ov.add || []).forEach(v => set.add(v));
    (ov.remove || []).forEach(v => set.delete(v));
  }
  // keep stable view order
  p.views = Object.keys(rules).filter(v => set.has(v));
  report.push({ id: p.id, lesson: p.lesson, title: t, views: p.views });
}

for (const r of report) {
  console.log(`${r.id}  L${r.lesson}  ${r.title}`);
  console.log(`        → ${r.views.join(', ') || '(none)'}`);
}

const counts = {};
for (const id of Object.keys(rules)) counts[id] = 0;
let untagged = 0;
for (const r of report) {
  if (r.views.length === 0) untagged++;
  for (const v of r.views) counts[v]++;
}
console.log('\n──── COUNTS ────');
for (const [id, n] of Object.entries(counts)) console.log(id.padEnd(18), n);
console.log('untagged'.padEnd(18), untagged, `/ ${points.length}`);

if (!process.argv.includes('--dry')) {
  writeFileSync(DATA, JSON.stringify(points, null, 2) + '\n');
  console.log('\n✔ wrote views[] to', DATA);
} else {
  console.log('\n(dry run — no write)');
}
