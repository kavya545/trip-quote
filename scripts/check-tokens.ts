// Fails the build if a colour is hardcoded outside src/tokens.ts, or if src/tokens.css is out of date.
// Run with: npm run check:tokens (also runs as part of npm run build)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { cssVar, tokens, type ColorToken } from '../src/tokens.ts';

const src = new URL('../src/', import.meta.url).pathname;
const files: string[] = [];
const walk = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|css)$/.test(f)) files.push(p); } };
walk(src);

const problems: string[] = [];
for (const f of files) {
  const rel = relative(src, f);
  if (rel === 'tokens.ts' || rel === 'tokens.css') continue;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const hit = line.match(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b(?![\w-])|rgba?\(\s*\d/);
    if (hit) problems.push(`src/${rel}:${i + 1}  ${hit[0]}  (use a token from src/tokens.ts)`);
  });
}
const names = Object.keys(tokens) as ColorToken[];
const css = readFileSync(join(src, 'tokens.css'), 'utf8');
for (const n of names) if (!css.includes(`${cssVar(n)}:${tokens[n].value};`)) problems.push(`src/tokens.css is out of date for ${n}: run npm run tokens`);

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`Tokens OK: ${names.length} tokens, no hardcoded colours in ${files.length - 2} files.`);
