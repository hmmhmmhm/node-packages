#!/usr/bin/env node
const { decode } = require('../dist/index.cjs');

const input = process.argv[2];

if (!input) {
  console.error('Usage: pnpm run decode <code>');
  console.error('Example: pnpm run decode "난-선"');
  process.exit(1);
}

const decoded = decode(input);

if (decoded === null) {
  console.error('Error: Invalid code format');
  process.exit(1);
}

console.log(decoded);
