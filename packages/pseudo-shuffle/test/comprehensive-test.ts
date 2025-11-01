import { encode, decode } from "pseudo-shuffle";

describe("pseudo-shuffle - Comprehensive Tests", () => {
  describe("Basic Encode/Decode", () => {
    it("Should encode and decode correctly for positive range", () => {
      for (let index = 0; index <= 100; index++) {
        const encoded = encode({ min: 0, max: 100, index });
        const decoded = decode({ min: 0, max: 100, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("Should encode and decode correctly for negative range", () => {
      for (let index = -50; index <= -10; index++) {
        const encoded = encode({ min: -50, max: -10, index });
        const decoded = decode({ min: -50, max: -10, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("Should encode and decode correctly for mixed range", () => {
      for (let index = -20; index <= 20; index++) {
        const encoded = encode({ min: -20, max: 20, index });
        const decoded = decode({ min: -20, max: 20, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Edge Cases - Minimum Range", () => {
    it("Should handle range with difference of 3 (minimum for algorithm)", () => {
      for (let index = 0; index <= 3; index++) {
        const encoded = encode({ min: 0, max: 3, index });
        const decoded = decode({ min: 0, max: 3, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("Should return same value when range difference is less than 3", () => {
      // Range difference = 2
      const encoded1 = encode({ min: 0, max: 2, index: 1 });
      expect(encoded1).toBe(1);

      // Range difference = 1
      const encoded2 = encode({ min: 5, max: 6, index: 5 });
      expect(encoded2).toBe(5);

      // Range difference = 0
      const encoded3 = encode({ min: 10, max: 10, index: 10 });
      expect(encoded3).toBe(10);
    });
  });

  describe("Edge Cases - Out of Range", () => {
    it("Should return same value when index is below min", () => {
      const encoded = encode({ min: 10, max: 20, index: 5 });
      expect(encoded).toBe(5);
      
      const decoded = decode({ min: 10, max: 20, index: 5 });
      expect(decoded).toBe(5);
    });

    it("Should return same value when index is above max (odd range)", () => {
      // Use odd range (difference = 9) to test out-of-range behavior
      const encoded = encode({ min: 10, max: 19, index: 25 });
      expect(encoded).toBe(25);
      
      const decoded = decode({ min: 10, max: 19, index: 25 });
      expect(decoded).toBe(25);
    });

    it("Should handle out of range for even range correctly", () => {
      // For even ranges, decode has special handling for values > max-1
      const min = 10;
      const max = 20; // even range (difference = 10)
      
      // Encode returns the value as-is when out of range
      const encoded = encode({ min, max, index: 25 });
      expect(encoded).toBe(25);
      
      // Decode has special logic for even ranges when index > max-1
      // It returns the middle value
      const decoded = decode({ min, max, index: 25 });
      const expectedMiddle = Math.ceil(min + (max - min) / 2);
      expect(decoded).toBe(expectedMiddle);
    });
  });

  describe("Even Range Handling (Non-Prime)", () => {
    it("Should handle even range correctly", () => {
      // Range 0-10 has difference of 10 (even)
      for (let index = 0; index <= 10; index++) {
        const encoded = encode({ min: 0, max: 10, index });
        const decoded = decode({ min: 0, max: 10, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("Should handle middle value in even range", () => {
      const min = 0;
      const max = 10;
      const middle = Math.ceil(min + (max - min) / 2); // 5
      
      const encoded = encode({ min, max, index: middle });
      const decoded = decode({ min, max, index: encoded });
      expect(decoded).toBe(middle);
    });

    it("Should handle max value in even range", () => {
      const min = 0;
      const max = 10;
      
      const encoded = encode({ min, max, index: max });
      const decoded = decode({ min, max, index: encoded });
      expect(decoded).toBe(max);
    });
  });

  describe("Custom Keys", () => {
    it("Should encode/decode with custom private key", () => {
      const privateKey = "my-secret-key";
      
      for (let index = 0; index <= 20; index++) {
        const encoded = encode({ min: 0, max: 20, index, privateKey });
        const decoded = decode({ min: 0, max: 20, index: encoded, privateKey });
        expect(decoded).toBe(index);
      }
    });

    it("Should encode/decode with custom public key", () => {
      const publicKey = "my-public-key";
      
      for (let index = 0; index <= 20; index++) {
        const encoded = encode({ min: 0, max: 20, index, publicKey });
        const decoded = decode({ min: 0, max: 20, index: encoded, publicKey });
        expect(decoded).toBe(index);
      }
    });

    it("Should encode/decode with both custom keys", () => {
      const privateKey = "my-secret-key";
      const publicKey = "my-public-key";
      
      for (let index = 0; index <= 20; index++) {
        const encoded = encode({ min: 0, max: 20, index, privateKey, publicKey });
        const decoded = decode({ min: 0, max: 20, index: encoded, privateKey, publicKey });
        expect(decoded).toBe(index);
      }
    });

    it("Should produce different results with different keys", () => {
      const index = 10;
      const min = 0;
      const max = 100;
      
      const encoded1 = encode({ min, max, index, privateKey: "key1" });
      const encoded2 = encode({ min, max, index, privateKey: "key2" });
      
      expect(encoded1).not.toBe(encoded2);
    });

    it("Should fail to decode with wrong key", () => {
      const index = 10;
      const min = 0;
      const max = 100;
      
      const encoded = encode({ min, max, index, privateKey: "key1" });
      const decoded = decode({ min, max, index: encoded, privateKey: "key2" });
      
      expect(decoded).not.toBe(index);
    });
  });

  describe("Large Range", () => {
    it("Should handle large positive range", () => {
      const min = 0;
      const max = 10000;
      const testIndices = [0, 100, 500, 1000, 5000, 9999, 10000];
      
      testIndices.forEach(index => {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      });
    });

    it("Should handle very large range (Base36 example)", () => {
      const min = 0;
      const max = 36 ** 7 - 1;
      const privateKey = "something-secret-any-string-like-this!";
      const testIndices = [0, 3, 100, 1000, 10000, 100000];
      
      testIndices.forEach(index => {
        const encoded = encode({ min, max, index, privateKey });
        const decoded = decode({ min, max, index: encoded, privateKey });
        expect(decoded).toBe(index);
      });
    });
  });

  describe("Uniqueness", () => {
    it("Should produce unique encoded values for different indices", () => {
      const min = 0;
      const max = 100;
      const encodedValues = new Set<number>();
      
      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        expect(encodedValues.has(encoded)).toBe(false);
        encodedValues.add(encoded);
      }
      
      expect(encodedValues.size).toBe(max - min + 1);
    });

    it("Should produce different encoded values for same index with different ranges", () => {
      const index = 10;
      
      const encoded1 = encode({ min: 0, max: 50, index });
      const encoded2 = encode({ min: 0, max: 100, index });
      const encoded3 = encode({ min: 5, max: 50, index });
      
      // They should be different (or at least not all the same)
      const uniqueValues = new Set([encoded1, encoded2, encoded3]);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });
  });

  describe("Deterministic Behavior", () => {
    it("Should produce same encoded value for same input", () => {
      const params = { min: 0, max: 100, index: 42 };
      
      const encoded1 = encode(params);
      const encoded2 = encode(params);
      const encoded3 = encode(params);
      
      expect(encoded1).toBe(encoded2);
      expect(encoded2).toBe(encoded3);
    });

    it("Should produce same decoded value for same input", () => {
      const params = { min: 0, max: 100, index: 42 };
      
      const decoded1 = decode(params);
      const decoded2 = decode(params);
      const decoded3 = decode(params);
      
      expect(decoded1).toBe(decoded2);
      expect(decoded2).toBe(decoded3);
    });
  });

  describe("Boundary Values", () => {
    it("Should handle min boundary correctly", () => {
      const min = 10;
      const max = 50;
      
      const encoded = encode({ min, max, index: min });
      const decoded = decode({ min, max, index: encoded });
      expect(decoded).toBe(min);
    });

    it("Should handle max boundary correctly", () => {
      const min = 10;
      const max = 50;
      
      const encoded = encode({ min, max, index: max });
      const decoded = decode({ min, max, index: encoded });
      expect(decoded).toBe(max);
    });

    it("Should handle zero as min", () => {
      const encoded = encode({ min: 0, max: 20, index: 0 });
      const decoded = decode({ min: 0, max: 20, index: encoded });
      expect(decoded).toBe(0);
    });

    it("Should handle negative boundaries", () => {
      const min = -100;
      const max = -50;
      
      const encoded = encode({ min, max, index: min });
      const decoded = decode({ min, max, index: encoded });
      expect(decoded).toBe(min);
    });
  });

  describe("Range Coverage", () => {
    it("Should cover all values in range when encoding", () => {
      const min = 0;
      const max = 50;
      const encodedValues = new Set<number>();
      
      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        encodedValues.add(encoded);
      }
      
      // All encoded values should be within the range
      encodedValues.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThanOrEqual(max);
      });
    });
  });

  describe("Odd Range Handling (Prime)", () => {
    it("Should handle odd range correctly", () => {
      // Range 0-9 has difference of 9 (odd)
      for (let index = 0; index <= 9; index++) {
        const encoded = encode({ min: 0, max: 9, index });
        const decoded = decode({ min: 0, max: 9, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("Should handle large odd range", () => {
      const min = 0;
      const max = 999; // difference of 999 (odd)
      const testIndices = [0, 100, 500, 999];
      
      testIndices.forEach(index => {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      });
    });
  });

  describe("Real-world Use Cases", () => {
    it("Should work for pagination shuffling", () => {
      // Shuffle page numbers 1-100
      const min = 1;
      const max = 100;
      const pageNumbers = [1, 25, 50, 75, 100];
      
      pageNumbers.forEach(page => {
        const shuffled = encode({ min, max, index: page });
        const original = decode({ min, max, index: shuffled });
        expect(original).toBe(page);
      });
    });

    it("Should work for ID obfuscation", () => {
      // Obfuscate sequential IDs
      const min = 1000;
      const max = 9999;
      const privateKey = "secret-api-key";
      
      const ids = [1000, 2500, 5000, 7500, 9999];
      
      ids.forEach(id => {
        const obfuscated = encode({ min, max, index: id, privateKey });
        const revealed = decode({ min, max, index: obfuscated, privateKey });
        expect(revealed).toBe(id);
        expect(obfuscated).not.toBe(id); // Should be different
      });
    });
  });
});
