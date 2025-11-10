import { encode, decode } from '../src/index';

describe('Very Large Number Handling with biggest module', () => {
  test('encode/decode extremely large numbers (> 10^100)', () => {
    // Test a number with 150 digits (way beyond BigInt's practical limits)
    const veryLargeNumber = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const encoded = encode(veryLargeNumber);
    expect(encoded).toBeTruthy();
    expect(encoded.length).toBeGreaterThan(0);
    
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(veryLargeNumber);
  });

  test('encode/decode number with exactly 100 digits', () => {
    const largeNumber = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const encoded = encode(largeNumber);
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(largeNumber);
  });

  test('encode/decode number with 200 digits', () => {
    const massiveNumber = '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const encoded = encode(massiveNumber);
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(massiveNumber);
  });

  test('encode/decode with BigInt beyond threshold', () => {
    // 10^100 + 1
    const bigNum = 10n ** 100n + 1n;
    
    const encoded = encode(bigNum);
    const decoded = decode(encoded);
    expect(decoded).toBe(bigNum);
  });

  test('encode/decode multiple very large numbers', () => {
    const testNumbers = [
      '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
      '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
      '987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098',
    ];

    for (const numStr of testNumbers) {
      const encoded = encode(numStr);
      const decoded = decode(encoded);
      expect(decoded.toString()).toBe(numStr);
    }
  });

  test('encode with custom separator for very large numbers', () => {
    const largeNumber = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const encoded = encode(largeNumber, ' ');
    expect(encoded).toContain(' ');
    
    const decoded = decode(encoded, ' ');
    expect(decoded.toString()).toBe(largeNumber);
  });

  test('handles transition between BigInt and biggest smoothly', () => {
    // Test numbers around the threshold
    const numbers = [
      '9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999', // 100 digits (at threshold)
      '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', // 101 digits (above threshold)
      '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999', // 99 digits (below threshold)
    ];

    for (const numStr of numbers) {
      const encoded = encode(numStr);
      const decoded = decode(encoded);
      expect(decoded.toString()).toBe(numStr);
    }
  });

  test('very large number maintains precision', () => {
    // A prime number with 120 digits
    const largePrime = '282475249000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003';
    
    const encoded = encode(largePrime);
    const decoded = decode(encoded);
    
    // Verify exact match
    expect(decoded.toString()).toBe(largePrime);
    
    // Verify it's not rounded or truncated
    expect(decoded.toString().length).toBe(largePrime.length);
  });

  test('encode zero with biggest path (edge case)', () => {
    // Even though zero is small, test it works with the string path
    const encoded = encode('0');
    expect(encoded).toBe('a');
    expect(decode(encoded)).toBe(0n);
  });

  test('encode single digit with biggest path', () => {
    const encoded = encode('5');
    expect(encoded).toBe('f');
    expect(decode(encoded)).toBe(5n);
  });

  test('very large number with different separators', () => {
    const largeNumber = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const separators = ['-', ' ', '_', '/', '+'];
    
    for (const sep of separators) {
      const encoded = encode(largeNumber, sep);
      expect(encoded).toContain(sep);
      const decoded = decode(encoded, sep);
      expect(decoded.toString()).toBe(largeNumber);
    }
  });

  test('encode/decode with auto-detect separator for large numbers', () => {
    const largeNumber = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const encoded = encode(largeNumber, '-');
    // Decode without specifying separator (auto-detect)
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(largeNumber);
  });

  test('performance: encode/decode very large number completes in reasonable time', () => {
    const largeNumber = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    
    const startEncode = Date.now();
    const encoded = encode(largeNumber);
    const encodeTime = Date.now() - startEncode;
    
    const startDecode = Date.now();
    const decoded = decode(encoded);
    const decodeTime = Date.now() - startDecode;
    
    expect(decoded.toString()).toBe(largeNumber);
    
    // Should complete within reasonable time (5 seconds each)
    expect(encodeTime).toBeLessThan(5000);
    expect(decodeTime).toBeLessThan(5000);
  });

  test('encode/decode number at exact threshold boundary', () => {
    // Create a number with exactly 100 digits
    const exactThreshold = '1' + '0'.repeat(99); // 10^99
    
    const encoded = encode(exactThreshold);
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(exactThreshold);
  });

  test('encode/decode number just above threshold', () => {
    // Create a number with 101 digits
    const justAbove = '1' + '0'.repeat(100); // 10^100
    
    const encoded = encode(justAbove);
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(justAbove);
  });

  test('encode/decode number just below threshold', () => {
    // Create a number with 99 digits
    const justBelow = '1' + '0'.repeat(98); // 10^98
    
    const encoded = encode(justBelow);
    const decoded = decode(encoded);
    expect(decoded.toString()).toBe(justBelow);
  });
});
