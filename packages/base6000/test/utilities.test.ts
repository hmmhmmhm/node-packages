import {
  getWord,
} from '../src/index';

describe('Utility Functions', () => {
  test('getWord returns correct word', () => {
    expect(getWord(0)).toBe('a');
    expect(getWord(1)).toBe('b');
    expect(getWord(26)).toBe('ai');
  });

  test('getWord throws on invalid index', () => {
    expect(() => getWord(-1)).toThrow();
    expect(() => getWord(6000)).toThrow();
  });
});
