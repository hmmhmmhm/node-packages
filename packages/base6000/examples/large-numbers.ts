import { encode, decode } from '../src/index';

// Example: Using string input for very large numbers
console.log('=== Large Number Encoding Examples ===\n');

// Example 1: String input (recommended for large numbers)
const largeNumStr = '373493284239852352787678';
console.log(`Input (string): ${largeNumStr}`);
const encoded1 = encode(largeNumStr);
console.log(`Encoded: ${encoded1}`);
const decoded1 = decode(encoded1);
console.log(`Decoded: ${decoded1.toString()}`);
console.log(`Match: ${decoded1.toString() === largeNumStr}\n`);

// Example 2: BigInt input
const largeNumBigInt = 373493284239852352787678n;
console.log(`Input (bigint): ${largeNumBigInt}`);
const encoded2 = encode(largeNumBigInt);
console.log(`Encoded: ${encoded2}`);
const decoded2 = decode(encoded2);
console.log(`Decoded: ${decoded2.toString()}`);
console.log(`Match: ${decoded2 === largeNumBigInt}\n`);

// Example 3: Safe number (works fine)
const safeNum = 123456;
console.log(`Input (safe number): ${safeNum}`);
const encoded3 = encode(safeNum);
console.log(`Encoded: ${encoded3}`);
const decoded3 = decode(encoded3);
console.log(`Decoded: ${decoded3.toString()}`);
console.log(`Match: ${decoded3 === BigInt(safeNum)}\n`);

// Example 4: Unsafe number (will throw error)
console.log('=== Unsafe Number Example ===');
const unsafeNum = 9007199254740992; // Number.MAX_SAFE_INTEGER + 1
console.log(`Input (unsafe number): ${unsafeNum}`);
try {
  const encoded4 = encode(unsafeNum);
  console.log(`Encoded: ${encoded4}`);
} catch (error) {
  console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
  console.log('Solution: Use string or BigInt instead');
  const encoded4 = encode(unsafeNum.toString());
  console.log(`Encoded (as string): ${encoded4}`);
  console.log(`Decoded: ${decode(encoded4).toString()}\n`);
}

// Example 5: Very large number beyond JavaScript number range
console.log('=== Extremely Large Number ===');
const extremelyLarge = '999999999999999999999999999999';
console.log(`Input: ${extremelyLarge}`);
const encoded5 = encode(extremelyLarge);
console.log(`Encoded: ${encoded5}`);
const decoded5 = decode(encoded5);
console.log(`Decoded: ${decoded5.toString()}`);
console.log(`Match: ${decoded5.toString() === extremelyLarge}`);
