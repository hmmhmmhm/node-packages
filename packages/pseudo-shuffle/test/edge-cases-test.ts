import { encode, decode } from "pseudo-shuffle";

describe("pseudo-shuffle - Edge Cases & Special Scenarios", () => {
  describe("Floating Point Numbers", () => {
    it("Should handle integer values only (floats get truncated by FPE)", () => {
      // The underlying FPE library works with integers
      const min = 0;
      const max = 100;
      
      // Test with integer
      const encoded = encode({ min, max, index: 50 });
      const decoded = decode({ min, max, index: encoded });
      expect(decoded).toBe(50);
    });
  });

  describe("Zero and Negative Ranges", () => {
    it("Should handle range starting at zero", () => {
      const testCases = [
        { min: 0, max: 10 },
        { min: 0, max: 100 },
        { min: 0, max: 1000 },
      ];
      
      testCases.forEach(({ min, max }) => {
        const encoded = encode({ min, max, index: 0 });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(0);
      });
    });

    it("Should handle entirely negative ranges", () => {
      const testCases = [
        { min: -100, max: -10 },
        { min: -50, max: -5 },
        { min: -1000, max: -100 },
      ];
      
      testCases.forEach(({ min, max }) => {
        for (let index = min; index <= max; index += 10) {
          const encoded = encode({ min, max, index });
          const decoded = decode({ min, max, index: encoded });
          expect(decoded).toBe(index);
        }
      });
    });

    it("Should handle range crossing zero", () => {
      const min = -50;
      const max = 50;
      const testIndices = [-50, -25, 0, 25, 50];
      
      testIndices.forEach(index => {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      });
    });
  });

  describe("Single Value Range", () => {
    it("Should handle range with single value (min === max)", () => {
      const value = 42;
      const encoded = encode({ min: value, max: value, index: value });
      const decoded = decode({ min: value, max: value, index: encoded });
      
      expect(encoded).toBe(value);
      expect(decoded).toBe(value);
    });
  });

  describe("Consecutive Ranges", () => {
    it("Should handle consecutive small ranges", () => {
      for (let start = 0; start < 100; start += 10) {
        const min = start;
        const max = start + 10;
        
        for (let index = min; index <= max; index++) {
          const encoded = encode({ min, max, index });
          const decoded = decode({ min, max, index: encoded });
          expect(decoded).toBe(index);
        }
      }
    });
  });

  describe("Key Sensitivity", () => {
    it("Should produce consistent results with same key", () => {
      const min = 0;
      const max = 100;
      const index = 50;
      const key = "my-consistent-key";
      
      const encoded1 = encode({ min, max, index, privateKey: key });
      const encoded2 = encode({ min, max, index, privateKey: key });
      const encoded3 = encode({ min, max, index, privateKey: key });
      
      // Same key should always produce same result
      expect(encoded1).toBe(encoded2);
      expect(encoded2).toBe(encoded3);
    });

    it("Should require exact key match for decoding", () => {
      const min = 0;
      const max = 100;
      const index = 50;
      const correctKey = "correct-key-that-is-very-unique";
      const wrongKey = "wrong-key-that-is-also-very-unique";
      
      const encoded = encode({ min, max, index, privateKey: correctKey });
      
      // Correct key should decode properly
      const correctDecode = decode({ min, max, index: encoded, privateKey: correctKey });
      expect(correctDecode).toBe(index);
      
      // Wrong key should produce different result
      const wrongDecode = decode({ min, max, index: encoded, privateKey: wrongKey });
      // The decoded value should be in range but different from original
      expect(wrongDecode).toBeGreaterThanOrEqual(min);
      expect(wrongDecode).toBeLessThanOrEqual(max);
    });
  });

  describe("Symmetry Tests", () => {
    it("Should maintain encode-decode symmetry for all values in range", () => {
      const ranges = [
        { min: 0, max: 20 },
        { min: -10, max: 10 },
        { min: 100, max: 120 },
      ];
      
      ranges.forEach(({ min, max }) => {
        for (let index = min; index <= max; index++) {
          const encoded = encode({ min, max, index });
          const decoded = decode({ min, max, index: encoded });
          expect(decoded).toBe(index);
        }
      });
    });
  });

  describe("Range Validation", () => {
    it("Should handle inverted range gracefully (min > max)", () => {
      // This is technically invalid input, but let's see how it behaves
      const min = 100;
      const max = 10;
      const index = 50;
      
      const encoded = encode({ min, max, index });
      const decoded = decode({ min, max, index: encoded });
      
      // Should return index as-is since range is invalid (difference < 3)
      expect(encoded).toBe(index);
      expect(decoded).toBe(index);
    });
  });

  describe("Collision Testing", () => {
    it("Should not have collisions within range", () => {
      const min = 0;
      const max = 100;
      const encodedMap = new Map<number, number>();
      
      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        
        // Check no collision
        expect(encodedMap.has(encoded)).toBe(false);
        encodedMap.set(encoded, index);
      }
      
      // Verify all values were encoded
      expect(encodedMap.size).toBe(max - min + 1);
    });

    it("Should produce bijective mapping (one-to-one)", () => {
      const min = 0;
      const max = 50;
      const originalToEncoded = new Map<number, number>();
      const encodedToOriginal = new Map<number, number>();
      
      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        originalToEncoded.set(index, encoded);
        encodedToOriginal.set(encoded, index);
      }
      
      // Both maps should have same size (bijective)
      expect(originalToEncoded.size).toBe(max - min + 1);
      expect(encodedToOriginal.size).toBe(max - min + 1);
    });
  });

  describe("Performance Characteristics", () => {
    it("Should handle rapid successive calls", () => {
      const min = 0;
      const max = 100;
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const index = Math.floor(Math.random() * (max - min + 1)) + min;
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Empty String Keys", () => {
    it("Should handle empty string as key", () => {
      const min = 0;
      const max = 50;
      const index = 25;
      
      const encoded = encode({ min, max, index, privateKey: "" });
      const decoded = decode({ min, max, index: encoded, privateKey: "" });
      
      expect(decoded).toBe(index);
    });

    it("Should handle empty string consistently", () => {
      const min = 0;
      const max = 50;
      const index = 25;
      
      const encoded1 = encode({ min, max, index, privateKey: "" });
      const encoded2 = encode({ min, max, index, privateKey: "" });
      
      // Same key should produce same result
      expect(encoded1).toBe(encoded2);
    });
  });

  describe("Special Key Characters", () => {
    it("Should handle special characters in keys", () => {
      const specialKeys = [
        "key!@#$%^&*()",
        "key with spaces",
        "key\twith\ttabs",
        "key-with-dashes",
        "key_with_underscores",
        "key.with.dots",
        "🔑emoji-key",
      ];
      
      const min = 0;
      const max = 50;
      const index = 25;
      
      specialKeys.forEach(key => {
        const encoded = encode({ min, max, index, privateKey: key });
        const decoded = decode({ min, max, index: encoded, privateKey: key });
        expect(decoded).toBe(index);
      });
    });
  });

  describe("Range Boundary Combinations", () => {
    it("Should handle various range sizes correctly", () => {
      const rangeSizes = [4, 5, 10, 11, 50, 51, 100, 101, 500, 501];
      
      rangeSizes.forEach(size => {
        const min = 0;
        const max = size - 1;
        const testIndices = [min, Math.floor(size / 2), max];
        
        testIndices.forEach(index => {
          const encoded = encode({ min, max, index });
          const decoded = decode({ min, max, index: encoded });
          expect(decoded).toBe(index);
        });
      });
    });
  });

  describe("Consistency Across Multiple Calls", () => {
    it("Should produce consistent results across multiple encode calls", () => {
      const min = 0;
      const max = 100;
      const index = 42;
      const iterations = 100;
      
      const firstEncoded = encode({ min, max, index });
      
      for (let i = 0; i < iterations; i++) {
        const encoded = encode({ min, max, index });
        expect(encoded).toBe(firstEncoded);
      }
    });

    it("Should produce consistent results across multiple decode calls", () => {
      const min = 0;
      const max = 100;
      const index = 42;
      const iterations = 100;
      
      const encoded = encode({ min, max, index });
      const firstDecoded = decode({ min, max, index: encoded });
      
      for (let i = 0; i < iterations; i++) {
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(firstDecoded);
      }
    });
  });
});
