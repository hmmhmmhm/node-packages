#!/usr/bin/env node
const { encode } = require('../dist/index.cjs');

const input = process.argv[2];

if (!input) {
  console.error('Usage: pnpm run encode <number>');
  console.error('Example: pnpm run encode 12345');
  process.exit(1);
}

const number = parseInt(input, 10);

if (isNaN(number)) {
  console.error('Error: Input must be a valid number');
  process.exit(1);
}

const encoded = encode(number);
console.log(encoded);
