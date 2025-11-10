import { encode, decode, getEmoji, getEmojiIndex } from '../src/index';

describe('Basic Encoding/Decoding', () => {
  test('encode 0 returns first emoji', () => {
    expect(encode(0)).toBe('😀');
  });

  test('decode first emoji returns 0', () => {
    expect(decode('😀')).toBe(0n);
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
      2429,
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
    const encoded = encode(123456, '-');
    expect(encoded).toContain('-');
    const decoded = decode(encoded, '-');
    expect(decoded).toBe(123456n);
  });

  test('encode with space separator', () => {
    const encoded = encode(123456, ' ');
    expect(encoded).toContain(' ');
    const decoded = decode(encoded, ' ');
    expect(decoded).toBe(123456n);
  });

  test('decode handles emojis without separator', () => {
    const num = 123456n;
    const encoded = encode(num);
    expect(decode(encoded)).toBe(num);
  });

  test('encode/decode very large numbers beyond Number.MAX_SAFE_INTEGER', () => {
    // Test numbers larger than Number.MAX_SAFE_INTEGER (2^53-1 = 9007199254740991)
    const veryLargeNumbers = [
      373493284239852352787678n,
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

  test('encode accepts string input for large numbers', () => {
    const numStr = '373493284239852352787678';
    const encoded = encode(numStr);
    const decoded = decode(encoded);
    expect(decoded).toBe(BigInt(numStr));
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

  test('getEmoji returns correct emoji at index', () => {
    expect(getEmoji(0)).toBe('😀');
    expect(getEmoji(1)).toBe('😁');
    expect(getEmoji(2)).toBe('😂');
  });

  test('getEmojiIndex returns correct index for emoji', () => {
    expect(getEmojiIndex('😀')).toBe(0);
    expect(getEmojiIndex('😁')).toBe(1);
    expect(getEmojiIndex('😂')).toBe(2);
  });

  test('getEmojiIndex returns -1 for unknown emoji', () => {
    expect(getEmojiIndex('🦄🦄🦄')).toBe(-1);
  });

  test('encode/decode with base value', () => {
    const encoded = encode(2429);
    expect(decode(encoded)).toBe(2429n);
  });

  test('encode/decode with multiple emojis', () => {
    const num = 9000000n; // Should require multiple emojis
    const encoded = encode(num);
    const decoded = decode(encoded);
    expect(decoded).toBe(num);
    // Verify it uses multiple emojis
    expect(Array.from(encoded).length).toBeGreaterThan(1);
  });
});
