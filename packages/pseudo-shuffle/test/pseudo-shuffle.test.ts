import { encode, decode } from "pseudo-shuffle";

describe("pseudo-shuffle", () => {
  describe("Basic encode/decode functionality", () => {
    it("should correctly encode and decode values in range", () => {
      const min = -5;
      const max = 100;

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle positive range (0-50)", () => {
      const min = 0;
      const max = 50;

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle negative range (-100 to -50)", () => {
      const min = -100;
      const max = -50;

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Edge cases", () => {
    it("should return original value for ranges smaller than 4", () => {
      // Range difference < 3 should return original value
      expect(encode({ min: 0, max: 2, index: 1 })).toBe(1);
      expect(encode({ min: 5, max: 7, index: 6 })).toBe(6);
      expect(decode({ min: 0, max: 2, index: 1 })).toBe(1);
    });

    it("should handle minimum valid range (difference of 4)", () => {
      const min = 0;
      const max = 4;

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle boundary values", () => {
      const min = -5;
      const max = 100;

      // Test min boundary
      const encodedMin = encode({ min, max, index: min });
      expect(decode({ min, max, index: encodedMin })).toBe(min);

      // Test max boundary
      const encodedMax = encode({ min, max, index: max });
      expect(decode({ min, max, index: encodedMax })).toBe(max);
    });
  });

  describe("Out of range values", () => {
    it("should return original value for indices below min", () => {
      const min = 0;
      const max = 100;
      const belowMin = -10;

      expect(encode({ min, max, index: belowMin })).toBe(belowMin);
      expect(decode({ min, max, index: belowMin })).toBe(belowMin);
    });

    it("should return original value for indices above max (encode)", () => {
      const min = 0;
      const max = 100;
      const aboveMax = 150;

      expect(encode({ min, max, index: aboveMax })).toBe(aboveMax);
    });
  });

  describe("Custom keys", () => {
    it("should produce different results with different private keys", () => {
      const min = 0;
      const max = 99; // Use odd range to avoid middle value special case
      const index = 50;

      const encoded1 = encode({ min, max, index, privateKey: "key1" });
      const encoded2 = encode({ min, max, index, privateKey: "key2" });

      expect(encoded1).not.toBe(encoded2);
    });

    it("should produce different results with different public keys", () => {
      const min = 0;
      const max = 99; // Use odd range to avoid middle value special case
      const index = 50;

      const encoded1 = encode({ min, max, index, publicKey: "key1" });
      const encoded2 = encode({ min, max, index, publicKey: "key2" });

      expect(encoded1).not.toBe(encoded2);
    });

    it("should correctly decode with matching custom keys", () => {
      const min = 0;
      const max = 99; // Use odd range for consistent behavior
      const privateKey = "my-private-key";
      const publicKey = "my-public-key";

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index, privateKey, publicKey });
        const decoded = decode({
          min,
          max,
          index: encoded,
          privateKey,
          publicKey,
        });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Even vs Odd range handling", () => {
    it("should handle even range differences", () => {
      const min = 0;
      const max = 10; // difference is 10 (even)

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle odd range differences", () => {
      const min = 0;
      const max = 11; // difference is 11 (odd)

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Shuffle properties", () => {
    it("should produce unique encoded values for all indices in range", () => {
      const min = 0;
      const max = 50;
      const encodedValues = new Set<number>();

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        expect(encodedValues.has(encoded)).toBe(false);
        encodedValues.add(encoded);
      }

      expect(encodedValues.size).toBe(max - min + 1);
    });

    it("should keep encoded values within the same range", () => {
      const min = 10;
      const max = 100;

      for (let index = min; index <= max; index++) {
        const encoded = encode({ min, max, index });
        expect(encoded).toBeGreaterThanOrEqual(min);
        expect(encoded).toBeLessThanOrEqual(max);
      }
    });

    it("should produce different encoded values for consecutive indices", () => {
      const min = 0;
      const max = 100;

      for (let index = min; index < max; index++) {
        const encoded1 = encode({ min, max, index });
        const encoded2 = encode({ min, max, index: index + 1 });
        expect(encoded1).not.toBe(encoded2);
      }
    });
  });

  describe("Large range handling", () => {
    it("should handle large positive ranges", () => {
      const min = 0;
      const max = 1000;
      const testIndices = [0, 250, 500, 750, 1000];

      testIndices.forEach((index) => {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      });
    });

    it("should handle large negative ranges", () => {
      const min = -1000;
      const max = -500;
      const testIndices = [-1000, -875, -750, -625, -500];

      testIndices.forEach((index) => {
        const encoded = encode({ min, max, index });
        const decoded = decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      });
    });
  });
});
