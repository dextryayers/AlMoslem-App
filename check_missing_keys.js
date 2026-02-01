
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('d:/web/qquran/app/lib/i18n.ts', 'utf8');

// Extract keys for each language
const extractKeys = (lang) => {
  const regex = new RegExp(`${lang}:\\s*{([^}]+)}`, 's'); // Simplified regex, might need to be more robust
  // Actually, let's just evaluate the object. It's a TS file, but if it's simple object structure we might be able to parse it or regex it.
  // The file has `export const TRANSLATIONS = { ... }`.
  // Let's try to extract the content between `id: {` and the matching `},`
  
  const startMarker = `${lang}: {`;
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return [];
  
  let openBraces = 1;
  let currentIndex = startIndex + startMarker.length;
  let extracted = '';
  
  while (openBraces > 0 && currentIndex < content.length) {
    const char = content[currentIndex];
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (openBraces > 0) extracted += char;
    currentIndex++;
  }
  
  const keys = [];
  const lines = extracted.split('\n');
  lines.forEach(line => {
    const match = line.match(/^\s*([a-zA-Z0-9_]+):/);
    if (match) {
      keys.push(match[1]);
    }
  });
  return keys;
};

const enKeys = extractKeys('en');
const idKeys = extractKeys('id');
const ruKeys = extractKeys('ru');
const jaKeys = extractKeys('ja');
const deKeys = extractKeys('de');
const esKeys = extractKeys('es');

const missingInId = enKeys.filter(key => !idKeys.includes(key));
const missingInRu = enKeys.filter(key => !ruKeys.includes(key));
const missingInJa = enKeys.filter(key => !jaKeys.includes(key));
const missingInDe = enKeys.filter(key => !deKeys.includes(key));
const missingInEs = enKeys.filter(key => !esKeys.includes(key));

console.log('Missing in ID:', missingInId);
console.log('Missing in RU:', missingInRu);
console.log('Missing in JA:', missingInJa);
console.log('Missing in DE:', missingInDe);
console.log('Missing in ES:', missingInEs);
