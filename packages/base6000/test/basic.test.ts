import { encode, decode } from '../src/index';

describe('Basic Encoding/Decoding', () => {
  test('encode 0 returns first word', () => {
    expect(encode(0)).toBe('a');
  });

  test('decode first word returns 0', () => {
    expect(decode('a')).toBe(0n);
    expect(decode('A')).toBe(0n); // case-insensitive
  });

  test('encode/decode round trip for small numbers', () => {
    for (let i = 0; i < 100; i++) {
      const encoded = encode(i);
      const decoded = decode(encoded);
      expect(decoded).toBe(BigInt(i));
    }
  });

  test('encode/decode round trip for large numbers', () => {
    const testNumbers = [
      1000,
      6000,
      10000,
      100000,
      1000000,
      123456789,
    ];

    for (const num of testNumbers) {
      const encoded = encode(num);
      const decoded = decode(encoded);
      expect(decoded).toBe(BigInt(num));
    }
  });

  test('encode/decode with bigint', () => {
    const bigNum = 123456789012345678901234567890n;
    const encoded = encode(bigNum);
    const decoded = decode(encoded);
    expect(decoded).toBe(bigNum);
  });

  test('encode with custom separator', () => {
    const encoded = encode(123456, '_');
    expect(encoded).toContain('_');
    const decoded = decode(encoded, '_');
    expect(decoded).toBe(123456n);
  });

  test('decode is case-insensitive', () => {
    const encoded = encode(123456);
    const lowerDecoded = decode(encoded.toLowerCase());
    const upperDecoded = decode(encoded.toUpperCase());
    expect(lowerDecoded).toBe(123456n);
    expect(upperDecoded).toBe(123456n);
  });

  test('decode auto-detects different separators', () => {
    const num = 123456789n;
    
    // Test with hyphen
    const withHyphen = encode(num, '-');
    expect(decode(withHyphen)).toBe(num);
    
    // Test with underscore
    const withUnderscore = encode(num, '_');
    expect(decode(withUnderscore)).toBe(num);
    
    // Test with space
    const withSpace = encode(num, ' ');
    expect(decode(withSpace)).toBe(num);
    
    // Test mixed case with different separators (all case-insensitive)
    expect(decode('HIGH-CATEGORIES-ARE-MOMENTUM')).toBe(123526224436345n);
    expect(decode('high_categories_are_momentum')).toBe(123526224436345n);
    expect(decode('High Categories Are Momentum')).toBe(123526224436345n);
    expect(decode('high-categories-are-momentum')).toBe(123526224436345n);
  });

  test('decode handles various special character separators', () => {
    const num = 12352n;
    const encoded = encode(num); // 'c-bird'
    
    // Test various special characters as separators
    expect(decode('c-bird')).toBe(num);  // hyphen
    expect(decode('c_bird')).toBe(num);  // underscore
    expect(decode('c bird')).toBe(num);  // space
    expect(decode('c/bird')).toBe(num);  // slash
    expect(decode('c+bird')).toBe(num);  // plus
    expect(decode('c@bird')).toBe(num);  // at sign
    expect(decode('c|bird')).toBe(num);  // pipe
    expect(decode('c.bird')).toBe(num);  // dot
    expect(decode('c,bird')).toBe(num);  // comma
    expect(decode('c;bird')).toBe(num);  // semicolon
    expect(decode('c:bird')).toBe(num);  // colon
    expect(decode('c!bird')).toBe(num);  // exclamation
    expect(decode('c?bird')).toBe(num);  // question mark
    expect(decode('c#bird')).toBe(num);  // hash
    expect(decode('c$bird')).toBe(num);  // dollar
    expect(decode('c%bird')).toBe(num);  // percent
    expect(decode('c&bird')).toBe(num);  // ampersand
    expect(decode('c*bird')).toBe(num);  // asterisk
  });

  test('decode handles multiple consecutive separators', () => {
    const num = 123456n;
    const encoded = encode(num); // 'U-Meeting'
    
    // Multiple spaces
    expect(decode('u  meeting')).toBe(num);
    
    // Multiple hyphens
    expect(decode('u--meeting')).toBe(num);
    
    // Mixed separators
    expect(decode('u -_meeting')).toBe(num);
  });

  test('encode/decode very large numbers beyond Number.MAX_SAFE_INTEGER', () => {
    // Test numbers larger than Number.MAX_SAFE_INTEGER (2^53-1 = 9007199254740991)
    const veryLargeNumbers = [
      373493284239852352787678n, // The example from the issue
      9007199254740992n, // Just above MAX_SAFE_INTEGER
      123456789012345678901234567890n,
      999999999999999999999999999999n,
    ];

    for (const num of veryLargeNumbers) {
      const encoded = encode(num);
      const decoded = decode(encoded);
      expect(decoded).toBe(num);
    }
  });

  test('specific large number from issue: 373493284239852352787678', () => {
    const num = 373493284239852352787678n;
    const encoded = encode(num);
    const decoded = decode(encoded);
    expect(decoded).toBe(num);
    // Verify the correct encoding (not the old truncated version)
    expect(encoded).toBe('i-de-figures-divided-bizrate-continues-enforcement');
  });

  test('encode accepts string input for large numbers', () => {
    const numStr = '373493284239852352787678';
    const encoded = encode(numStr);
    const decoded = decode(encoded);
    expect(decoded).toBe(BigInt(numStr));
    expect(encoded).toBe('i-de-figures-divided-bizrate-continues-enforcement');
  });

  test('encode throws error for unsafe numbers', () => {
    const unsafeNumber = 9007199254740992; // Number.MAX_SAFE_INTEGER + 1
    expect(() => encode(unsafeNumber)).toThrow('exceeds safe integer range');
  });

  test('encode accepts string with trailing n', () => {
    const numStr = '123456789n';
    const encoded = encode(numStr);
    const decoded = decode(encoded);
    expect(decoded).toBe(123456789n);
  });

});
