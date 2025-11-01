#!/usr/bin/env node
const { encode, decode } = require('../dist/index.cjs');

const startPoint = parseInt(process.argv[2], 10);
const endPoint = parseInt(process.argv[3], 10);

// 입력 검증
if (process.argv.length < 4) {
  console.error('Usage: pnpm run validate <start> <end>');
  console.error('Example: pnpm run validate 0 100000');
  process.exit(1);
}

if (isNaN(startPoint)) {
  console.error('Error: First argument must be a number');
  process.exit(1);
}

if (isNaN(endPoint)) {
  console.error('Error: Second argument must be a number');
  process.exit(1);
}

if (startPoint > endPoint) {
  console.error('Error: Start point must be less than or equal to end point');
  process.exit(1);
}

let stoppedPoint = null;

console.log(`Starting integrity check from ${startPoint} to ${endPoint}...\n`);
console.time('Validation time');

for (let i = startPoint; i <= endPoint; i++) {
  const encoded = encode(i);
  const decoded = decode(encoded);
  
  if (i % 10000 === 0) {
    console.log(`✓ Validated up to ${i}/${endPoint}`);
  }
  
  if (i !== decoded) {
    stoppedPoint = i;
    break;
  }
}

console.log();

if (stoppedPoint === null) {
  console.log(`✅ Integrity check successful for range ${startPoint}~${endPoint}`);
} else {
  console.error(`❌ Integrity check failed at index ${stoppedPoint}`);
  process.exit(1);
}

console.timeEnd('Validation time');
