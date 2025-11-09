import {
  encode,
  decode,
} from '../src/index';

describe('Real-world Use Cases', () => {
  test('Large number encoding', () => {
    // Test with a very large number (e.g., timestamp in microseconds)
    const timestamp = BigInt(Date.now()) * 1000n;
    const encoded = encode(timestamp);
    const decoded = decode(encoded);
    
    expect(decoded).toBe(timestamp);
  });

  test('Memorable identifiers', () => {
    // Convert timestamp to memorable identifier
    const timestamp = Date.now();
    const memorable = encode(timestamp);
    const decoded = decode(memorable);
    
    expect(Number(decoded)).toBe(timestamp);
  });
});
