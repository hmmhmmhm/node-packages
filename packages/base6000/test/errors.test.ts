import { encode, decode } from '../src/index';

describe('Error Handling', () => {
  test('encode throws on negative numbers', () => {
    expect(() => encode(-1)).toThrow('Only non-negative numbers can be encoded');
  });

  test('encode throws on non-integer numbers', () => {
    expect(() => encode(3.14)).toThrow('Only integers can be encoded');
  });

  test('decode throws on empty string', () => {
    expect(() => decode('')).toThrow('Encoded string cannot be empty');
  });

  test('decode throws on invalid word', () => {
    expect(() => decode('InvalidWord')).toThrow('Invalid word in encoded string');
  });
});
