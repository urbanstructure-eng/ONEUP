
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /rounded-([a-zA-Z0-9-]+)/g;
const matches = [];
let match;

while ((match = regex.exec(content)) !== null) {
  matches.push(match[1]);
}

const uniqueMatches = [...new Set(matches)];
const nonStandard = uniqueMatches.filter(m => m !== '2xl' && m !== 'full');

console.log('Unique rounding suffixes found:', uniqueMatches);
console.log('Non-standard suffixes (not 2xl or full):', nonStandard);

if (nonStandard.length > 0) {
    console.log('\nOccurrences of non-standard rounding:');
    nonStandard.forEach(suffix => {
        const lineRegex = new RegExp(`.*rounded-${suffix}.*`, 'g');
        const lineMatches = content.match(lineRegex);
        if (lineMatches) {
            console.log(`\nSuffix: ${suffix}`);
            lineMatches.forEach(line => console.log(`  ${line.trim()}`));
        }
    });
}
