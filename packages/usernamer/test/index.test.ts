import { encode as encodeEn, decode as decodeEn, getMaxCombinableIndex, requiresSuffix } from '../src/index';
import { encode as encodeKo, decode as decodeKo } from '../src/ko';

describe('Usernamer', () => {
  describe('Korean Language', () => {

    describe('encode', () => {
      it('should encode index 0 as level1 only', () => {
        const result = encodeKo(0);
        expect(result).toBe('알파카');
      });

      it('should encode index 1 as second level1 item', () => {
        const result = encodeKo(1);
        expect(result).toBe('고양이');
      });

      it('should encode index 99 as last level1 item', () => {
        const result = encodeKo(99);
        expect(result).toBe('사자');
      });

      it('should encode index 100 as level2 + level1', () => {
        const result = encodeKo(100);
        expect(result).toBe('귀여운 알파카');
      });

      it('should encode index 199 as level2 + last level1', () => {
        const result = encodeKo(199);
        expect(result).toBe('귀여운 사자');
      });

      it('should encode index 10000 as level3 + level1', () => {
        const result = encodeKo(10000);
        expect(result).toBe('모자를 쓴 알파카');
      });

      it('should encode index 1000000 as level4 + level1', () => {
        const result = encodeKo(1000000);
        expect(result).toBe('맑은 날 알파카');
      });

      it('should encode max combinable index (99,999,999)', () => {
        const result = encodeKo(99999999);
        expect(result).toBe('야시장의 퍼즐 맞추는 깡충거리는 사자');
      });

      it('should encode overflow index with numeric suffix', () => {
        const result = encodeKo(100000000);
        expect(result).toBe('겨울날의 알파카 0');
      });

      it('should encode large overflow index', () => {
        const result = encodeKo(100000089);
        expect(result).toBe('겨울날의 수달 9');
      });

      it('should throw error for negative index', () => {
        expect(() => encodeKo(-1)).toThrow('non-negative integer');
      });

      it('should throw error for non-integer index', () => {
        expect(() => encodeKo(1.5)).toThrow('non-negative integer');
      });
    });

    describe('decode', () => {
      it('should decode level1 only username', () => {
        const result = decodeKo('알파카');
        expect(result).toBe(0);
      });

      it('should decode level2 + level1 username', () => {
        const result = decodeKo('귀여운 알파카');
        expect(result).toBe(100);
      });

      it('should decode level3 + level1 username', () => {
        const result = decodeKo('모자를 쓴 알파카');
        expect(result).toBe(10000);
      });

      it('should decode level4 + level1 username', () => {
        const result = decodeKo('맑은 날 알파카');
        expect(result).toBe(1000000);
      });

      it('should decode username with numeric suffix', () => {
        const result = decodeKo('겨울날의 알파카 0');
        expect(result).toBe(100000000);
      });

      it('should decode username with large numeric suffix', () => {
        const result = decodeKo('겨울날의 수달 9');
        expect(result).toBe(100000089);
      });

      it('should throw error for empty username', () => {
        expect(() => decodeKo('')).toThrow('cannot be empty');
      });

      it('should throw error for invalid username', () => {
        expect(() => decodeKo('존재하지않는단어')).toThrow('Invalid username');
      });
    });

    describe('encode/decode round-trip', () => {
      const testCases = [0, 1, 50, 99, 100, 500, 9999, 10000, 50000, 99999, 100000, 
                         999999, 1000000, 5000000, 99999999, 100000000, 100000050];

      testCases.forEach(index => {
        it(`should round-trip index ${index}`, () => {
          const encoded = encodeKo(index);
          const decoded = decodeKo(encoded);
          expect(decoded).toBe(index);
        });
      });
    });
  });

  describe('English Language', () => {

    describe('encode', () => {
      it('should encode index 0 as level1 only', () => {
        const result = encodeEn(0);
        expect(result).toBe('alpaca');
      });

      it('should encode index 100 as level2 + level1', () => {
        const result = encodeEn(100);
        expect(result).toBe('adorable alpaca');
      });

      it('should encode with numeric suffix for overflow', () => {
        const result = encodeEn(100000000);
        expect(result).toContain(' 0');
      });
    });

    describe('decode', () => {
      it('should decode level1 only username', () => {
        const result = decodeEn('alpaca');
        expect(result).toBe(0);
      });

      it('should decode level2 + level1 username', () => {
        const result = decodeEn('adorable alpaca');
        expect(result).toBe(100);
      });
    });

    describe('encode/decode round-trip', () => {
      const testCases = [0, 1, 99, 100, 10000, 1000000, 99999999, 100000000];

      testCases.forEach(index => {
        it(`should round-trip index ${index}`, () => {
          const encoded = encodeEn(index);
          const decoded = decodeEn(encoded);
          expect(decoded).toBe(index);
        });
      });
    });
  });

  describe('Utility Functions', () => {
    it('getMaxCombinableIndex should return 100,000,000', () => {
      expect(getMaxCombinableIndex()).toBe(100000000);
    });

    it('requiresSuffix should return false for indices below max', () => {
      expect(requiresSuffix(0)).toBe(false);
      expect(requiresSuffix(99999999)).toBe(false);
    });

    it('requiresSuffix should return true for indices at or above max', () => {
      expect(requiresSuffix(100000000)).toBe(true);
      expect(requiresSuffix(100000001)).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    describe('Korean Data', () => {
      it('should have no duplicate words across all levels', () => {
        const koreanLevel1 = require('../data/korean/level1.json');
        const koreanLevel2 = require('../data/korean/level2.json');
        const koreanLevel3 = require('../data/korean/level3.json');
        const koreanLevel4 = require('../data/korean/level4.json');

        const allWords = [
          ...koreanLevel1,
          ...koreanLevel2,
          ...koreanLevel3,
          ...koreanLevel4,
        ];

        const wordSet = new Set(allWords);
        const duplicates: string[] = [];
        
        allWords.forEach((word, index) => {
          if (allWords.indexOf(word) !== index) {
            if (!duplicates.includes(word)) {
              duplicates.push(word);
            }
          }
        });

        if (duplicates.length > 0) {
          console.error('Korean duplicate words found:', duplicates);
        }

        expect(wordSet.size).toBe(allWords.length);
        expect(duplicates).toEqual([]);
      });

      it('should have exactly 100 items in each level', () => {
        const koreanLevel1 = require('../data/korean/level1.json');
        const koreanLevel2 = require('../data/korean/level2.json');
        const koreanLevel3 = require('../data/korean/level3.json');
        const koreanLevel4 = require('../data/korean/level4.json');

        expect(koreanLevel1.length).toBe(100);
        expect(koreanLevel2.length).toBe(100);
        expect(koreanLevel3.length).toBe(100);
        expect(koreanLevel4.length).toBe(100);
      });
    });

    describe('English Data', () => {
      it('should have no duplicate words across all levels', () => {
        const englishLevel1 = require('../data/english/level1.json');
        const englishLevel2 = require('../data/english/level2.json');
        const englishLevel3 = require('../data/english/level3.json');
        const englishLevel4 = require('../data/english/level4.json');

        const allWords = [
          ...englishLevel1,
          ...englishLevel2,
          ...englishLevel3,
          ...englishLevel4,
        ];

        const wordSet = new Set(allWords);
        const duplicates: string[] = [];
        
        allWords.forEach((word, index) => {
          if (allWords.indexOf(word) !== index) {
            if (!duplicates.includes(word)) {
              duplicates.push(word);
            }
          }
        });

        if (duplicates.length > 0) {
          console.error('English duplicate words found:', duplicates);
        }

        expect(wordSet.size).toBe(allWords.length);
        expect(duplicates).toEqual([]);
      });

      it('should have exactly 100 items in each level', () => {
        const englishLevel1 = require('../data/english/level1.json');
        const englishLevel2 = require('../data/english/level2.json');
        const englishLevel3 = require('../data/english/level3.json');
        const englishLevel4 = require('../data/english/level4.json');

        expect(englishLevel1.length).toBe(100);
        expect(englishLevel2.length).toBe(100);
        expect(englishLevel3.length).toBe(100);
        expect(englishLevel4.length).toBe(100);
      });
    });
  });
});
