// Writes JSON Schema files for the quote data, so editors validate the JSON as you type.
// Run with: npm run schema
import { writeFileSync } from 'node:fs';
import { z } from 'zod';
import { FileSchemas } from '../src/api/schema.ts';

for (const [name, schema] of Object.entries(FileSchemas)) {
  const json = z.toJSONSchema(schema, { io: 'input', target: 'draft-2020-12' });
  writeFileSync(new URL(`../src/data/schema/${name}.schema.json`, import.meta.url), JSON.stringify(json, null, 2) + '\n');
  console.log(`src/data/schema/${name}.schema.json`);
}
