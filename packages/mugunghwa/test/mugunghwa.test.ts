import { encode, decode, decimalBase, multipleBase, expectLength } from '../src/index';

describe('mugunghwa', () => {
  describe('encode', () => {
    it('should encode a number to a string', () => {
      const result = encode(0);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should encode small numbers correctly', () => {
      const result = encode(1);
      expect(result).toBeTruthy();
    });

    it('should return null for negative numbers', () => {
      const result = encode(-1);
      expect(result).toBeNull();
    });

    it('should return null for decimal numbers', () => {
      const result = encode(1.5);
      expect(result).toBeNull();
    });

    it('should return null for NaN', () => {
      const result = encode(NaN);
      expect(result).toBeNull();
    });

    it('should encode large numbers', () => {
      const result = encode(1000000);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should use custom separator', () => {
      const result = encode(100, '_');
      expect(result).toBeTruthy();
      if (result && result.length > 2) {
        expect(result.includes('_')).toBe(true);
      }
    });
  });

  describe('decode', () => {
    it('should decode an encoded string back to the original number', () => {
      const original = 12345;
      const encoded = encode(original);
      expect(encoded).toBeTruthy();
      if (encoded) {
        const decoded = decode(encoded);
        expect(decoded).toBe(original);
      }
    });

    it('should handle encode-decode cycle for various numbers', () => {
      const testNumbers = [0, 1, 10, 100, 1000, 10000, 100000];
      testNumbers.forEach(num => {
        const encoded = encode(num);
        expect(encoded).toBeTruthy();
        if (encoded) {
          const decoded = decode(encoded);
          expect(decoded).toBe(num);
        }
      });
    });

    it('should return null for empty string', () => {
      const result = decode('');
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = decode(null as any);
      expect(result).toBeNull();
    });

    it('should decode with custom separator', () => {
      const original = 100;
      const encoded = encode(original, '_');
      expect(encoded).toBeTruthy();
      if (encoded) {
        const decoded = decode(encoded, '_');
        expect(decoded).toBe(original);
      }
    });
  });

  describe('decimalBase', () => {
    it('should convert multiple base to decimal', () => {
      const result = decimalBase([10, 10], [1, 5]);
      expect(result).toBe(15);
    });

    it('should handle single digit', () => {
      const result = decimalBase([10], [5]);
      expect(result).toBe(5);
    });
  });

  describe('multipleBase', () => {
    it('should convert decimal to multiple base', () => {
      const result = multipleBase([10, 10], 15);
      expect(result).toEqual([1, 5]);
    });

    it('should handle single digit', () => {
      const result = multipleBase([10], 5);
      expect(result).toEqual([5]);
    });
  });

  describe('expectLength', () => {
    it('should calculate expected length for small numbers', () => {
      const result = expectLength(0);
      expect(result).toBe(1);
    });

    it('should calculate expected length for larger numbers', () => {
      const result = expectLength(100);
      expect(result).toBeGreaterThan(1);
    });
  });
});
