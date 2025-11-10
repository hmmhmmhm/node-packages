import { encode, decode, getEmoji } from '../src/index';

describe('Error Handling', () => {
  test('encode throws error for negative numbers', () => {
    expect(() => encode(-1)).toThrow('Only non-negative numbers can be encoded');
  });

  test('encode throws error for non-integers', () => {
    expect(() => encode(3.14)).toThrow('Only integers can be encoded');
  });

  test('decode throws error for empty string', () => {
    expect(() => decode('')).toThrow('Encoded string cannot be empty');
  });

  test('decode throws error for invalid emoji', () => {
    expect(() => decode('invalid')).toThrow('Invalid emoji in encoded string');
  });

  test('getEmoji throws error for negative index', () => {
    expect(() => getEmoji(-1)).toThrow('Index must be between 0 and');
  });

  test('getEmoji throws error for index >= BASE', () => {
    expect(() => getEmoji(3000)).toThrow('Index must be between 0 and');
  });

  test('encode throws error for invalid string format', () => {
    expect(() => encode('not a number')).toThrow('Invalid number format');
  });
});
