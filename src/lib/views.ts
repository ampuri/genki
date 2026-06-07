// Preset views: curated tag-based filters over the grammar points.
// A point's `views` array (set by scripts/tag-views.mjs) holds these ids.

export interface ViewDef {
  id: string;
  label: string;
  blurb: string;
}

export interface ViewFamily {
  name: string;
  views: ViewDef[];
}

export const VIEW_FAMILIES: ViewFamily[] = [
  {
    name: 'Parts of speech',
    views: [
      { id: 'nouns', label: 'Nouns', blurb: 'Copula, の-modification, counters, naming' },
      { id: 'verbs', label: 'Verbs', blurb: 'Conjugation, types, and verb forms' },
      { id: 'adjectives', label: 'Adjectives', blurb: 'い / な adjectives and their forms' },
      { id: 'particles', label: 'Particles', blurb: 'を・で・に・は・が・も and friends' },
      { id: 'adverbs', label: 'Adverbs & quantity', blurb: 'Frequency, amount, manner' },
      { id: 'demonstratives', label: 'Demonstratives (こそあど)', blurb: 'これ／それ／あれ／どれ' },
    ],
  },
  {
    name: 'Forms',
    views: [
      { id: 'present', label: 'Present tense', blurb: 'Long & plain non-past forms' },
      { id: 'past', label: 'Past tense', blurb: 'Past forms of verbs, adjectives, です' },
      { id: 'te-form', label: 'Te-form', blurb: 'て-form and everything built on it' },
      { id: 'short-form', label: 'Short / plain form', blurb: 'Plain form and what attaches to it' },
      { id: 'verb-stem', label: 'Verb stem', blurb: 'Stem-based constructs (ます, ながら, やすい…)' },
      { id: 'negative', label: 'Negative (ない)', blurb: 'ない-form constructs' },
      { id: 'volitional', label: 'Volitional', blurb: 'よう / volitional form' },
      { id: 'advanced-verb', label: 'Advanced verb forms', blurb: 'Potential, passive, causative, imperative' },
    ],
  },
  {
    name: 'Function & meaning',
    views: [
      { id: 'requests', label: 'Requests & permission', blurb: 'Asking, allowing, prohibiting' },
      { id: 'obligation', label: 'Obligation & necessity', blurb: 'Must, have to, should' },
      { id: 'giving-receiving', label: 'Giving & receiving', blurb: 'あげる／くれる／もらう' },
      { id: 'comparison', label: 'Comparison', blurb: 'More than, most, ～のほうが' },
      { id: 'desire', label: 'Desire & intention', blurb: 'Want, plan, intend to' },
      { id: 'quoting', label: 'Quoting & reporting', blurb: 'と思う, と言う, hearsay' },
      { id: 'conditionals', label: 'Conditionals', blurb: 'たら・ば・と・なら' },
      { id: 'politeness', label: 'Politeness & speech style', blurb: 'Keigo, humble, casual' },
      { id: 'reasons', label: 'Reasons & cause', blurb: 'から, ので, んです' },
    ],
  },
];

const byId = new Map<string, ViewDef>();
for (const fam of VIEW_FAMILIES) for (const v of fam.views) byId.set(v.id, v);

export function getView(id: string): ViewDef | undefined {
  return byId.get(id);
}
