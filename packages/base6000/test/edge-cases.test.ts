import { encode, decode } from '../src/index';

describe('Edge Cases', () => {
  test('encode/decode boundary values', () => {
    const boundaries = [
      0,
      5999,      // Last single-word value
      6000,      // First two-word value
      35999999,  // Last two-word value (6000^2 - 1)
      36000000,  // First three-word value (6000^2)
    ];

    for (const num of boundaries) {
      const encoded = encode(num);
      const decoded = decode(encoded);
      expect(decoded).toBe(BigInt(num));
    }
  });

  test('whitespace handling in decode', () => {
    const encoded = encode(123456);
    const withSpaces = `  ${encoded}  `;
    const decoded = decode(withSpaces);
    expect(decoded).toBe(123456n);
  });

  test('mixed case in standard decode', () => {
    const testCases = [
      'A',
      'a',
      'A-B',
      'a-b',
      'A-b',
      'a-B',
    ];

    for (const testCase of testCases) {
      expect(() => decode(testCase)).not.toThrow();
    }
  });
});
