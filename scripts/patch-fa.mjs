import { readFileSync, writeFileSync } from 'node:fs';

let src = readFileSync('scripts/extract.mjs', 'utf8');

const newMap = `// Font Awesome private-use codepoints used inside grammar content
const FA_REPLACE = new Map([
  ['\\uF061', '→'],  // fa-arrow-right
  ['\\uF060', '←'],  // fa-arrow-left
  ['\\uF07E', '↔'],  // fa-arrows-h
  ['\\uF176', '↑'],  // fa-long-arrow-up
  ['\\uF175', '↓'],  // fa-long-arrow-down
]);`;

// Replace the whole FA_REPLACE block
src = src.replace(/\/\/ Font Awesome private[\s\S]*?\]\);/, newMap);
writeFileSync('scripts/extract.mjs', src);
console.log('patched');
