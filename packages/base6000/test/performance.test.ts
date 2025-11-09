import { encode, decode } from '../src/index';

describe('Performance Characteristics', () => {
  test('encoding large numbers is efficient', () => {
    const largeNum = 999999999999999n;
    const start = Date.now();
    const encoded = encode(largeNum);
    const encodeTime = Date.now() - start;
    
    expect(encodeTime).toBeLessThan(100); // Should be fast
    expect(encoded).toBeTruthy();
  });

  test('decoding is efficient', () => {
    const encoded = encode(999999999999999n);
    const start = Date.now();
    const decoded = decode(encoded);
    const decodeTime = Date.now() - start;
    
    expect(decodeTime).toBeLessThan(100); // Should be fast
    expect(decoded).toBe(999999999999999n);
  });
});
