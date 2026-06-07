# Genki Pocket Grammar Reference

A pocket grammar reference for Genki I & II (3rd Edition) — 197 grammar points with search, furigana, and links to practice exercises.

Live site: https://ampuri.github.io/genki/

## Development

```bash
npm install
npm run dev
```

## Data extraction

The grammar data is pre-extracted and committed as `src/data/grammar.json`. To re-extract from the source HTML:

```bash
npm run extract
```

## Build

```bash
npm run build
```

## Deployment

Pushes to `main` trigger automatic deployment to GitHub Pages via GitHub Actions.

**One-time setup:** In the GitHub repo, go to Settings → Pages → Build and deployment → Source → set to **GitHub Actions**.

## Attribution

Grammar data adapted from [Genki Study Resources](https://github.com/SethClydesdale/genki-study-resources) by Seth Clydesdale (MIT). See `data/source/LICENSE`.
