// Script to screenshot each digit individually
// Usage: node scripts/screenshot-digits.mjs
// Requires: dev server running on localhost:5173, playwright installed

import { execSync } from 'child_process';

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

for (const d of digits) {
  const url = `http://localhost:5173/?digit=${d}`;
  const out = `images/digit-${d}.png`;
  console.log(`Capturing digit ${d}...`);
  execSync(`npx playwright screenshot --viewport-size="300,450" "${url}" "${out}"`, { stdio: 'inherit' });
}

console.log('Done! All digit screenshots saved to images/');
