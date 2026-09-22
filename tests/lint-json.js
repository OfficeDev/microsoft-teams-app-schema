/*
 * Formatting check for the schema files in this repository.
 *
 * The schemas are hand-edited, so this guards the conventions that are already
 * used by every *.schema.json file in the repository root:
 *   - the file is parseable JSON;
 *   - indentation uses spaces only, in multiples of two;
 *   - no trailing whitespace.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const schemaFiles = fs
  .readdirSync(repoRoot)
  .filter((file) => file.endsWith('.schema.json'))
  .sort();

const failures = [];

for (const file of schemaFiles) {
  const contents = fs.readFileSync(path.join(repoRoot, file), 'utf8');

  try {
    JSON.parse(contents);
  } catch (error) {
    failures.push(`${file}: invalid JSON - ${error.message}`);
    continue;
  }

  contents.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;

    if (line.includes('\t')) {
      failures.push(`${file}:${lineNumber}: tab character, expected spaces`);
    }

    if (/\s$/.test(line)) {
      failures.push(`${file}:${lineNumber}: trailing whitespace`);
    }

    const indent = /^( +)/.exec(line);
    if (indent && indent[1].length % 2 !== 0) {
      failures.push(`${file}:${lineNumber}: indentation is not a multiple of two spaces`);
    }
  });
}

if (schemaFiles.length === 0) {
  failures.push('no *.schema.json files were found in the repository root');
}

if (failures.length > 0) {
  console.error('Formatting check failed:');
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  process.exit(1);
}

console.log(`Formatting check passed for ${schemaFiles.length} schema file(s).`);
