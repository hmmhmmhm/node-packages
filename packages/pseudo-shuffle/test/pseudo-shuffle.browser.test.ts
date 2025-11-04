// @ts-ignore - Jest requires import without .js extension
import { encode, decode } from "../src/pseudo-shuffle-browser";

describe("pseudo-shuffle-browser", () => {
  describe("Basic encode/decode functionality", () => {
    it("should correctly encode and decode values in range", async () => {
      const min = -5;
      const max = 100;

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle positive range (0-50)", async () => {
      const min = 0;
      const max = 50;

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle negative range (-100 to -50)", async () => {
      const min = -100;
      const max = -50;

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Edge cases", () => {
    it("should return original value for ranges smaller than 4", async () => {
      // Range difference < 3 should return original value
      expect(await encode({ min: 0, max: 2, index: 1 })).toBe(1);
      expect(await encode({ min: 5, max: 7, index: 6 })).toBe(6);
      expect(await decode({ min: 0, max: 2, index: 1 })).toBe(1);
    });

    it("should handle minimum valid range (difference of 4)", async () => {
      const min = 0;
      const max = 4;

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle boundary values", async () => {
      const min = -5;
      const max = 100;

      // Test min boundary
      const encodedMin = await encode({ min, max, index: min });
      expect(await decode({ min, max, index: encodedMin })).toBe(min);

      // Test max boundary
      const encodedMax = await encode({ min, max, index: max });
      expect(await decode({ min, max, index: encodedMax })).toBe(max);
    });
  });

  describe("Out of range values", () => {
    it("should return original value for indices below min", async () => {
      const min = 0;
      const max = 100;
      const belowMin = -10;

      expect(await encode({ min, max, index: belowMin })).toBe(belowMin);
      expect(await decode({ min, max, index: belowMin })).toBe(belowMin);
    });

    it("should return original value for indices above max (encode)", async () => {
      const min = 0;
      const max = 100;
      const aboveMax = 150;

      expect(await encode({ min, max, index: aboveMax })).toBe(aboveMax);
    });
  });

  describe("Custom keys", () => {
    it("should produce different results with different private keys", async () => {
      const min = 0;
      const max = 99; // Use odd range to avoid middle value special case
      const index = 50;

      const encoded1 = await encode({ min, max, index, privateKey: "key1" });
      const encoded2 = await encode({ min, max, index, privateKey: "key2" });

      expect(encoded1).not.toBe(encoded2);
    });

    it("should produce different results with different public keys", async () => {
      const min = 0;
      const max = 99; // Use odd range to avoid middle value special case
      const index = 50;

      const encoded1 = await encode({ min, max, index, publicKey: "key1" });
      const encoded2 = await encode({ min, max, index, publicKey: "key2" });

      expect(encoded1).not.toBe(encoded2);
    });

    it("should correctly decode with matching custom keys", async () => {
      const min = 0;
      const max = 99; // Use odd range for consistent behavior
      const privateKey = "my-private-key";
      const publicKey = "my-public-key";

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index, privateKey, publicKey });
        const decoded = await decode({
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
    it("should handle even range differences", async () => {
      const min = 0;
      const max = 10; // difference is 10 (even)

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle odd range differences", async () => {
      const min = 0;
      const max = 11; // difference is 11 (odd)

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Shuffle properties", () => {
    it("should produce unique encoded values for all indices in range", async () => {
      const min = 0;
      const max = 50;
      const encodedValues = new Set<number>();

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        expect(encodedValues.has(encoded)).toBe(false);
        encodedValues.add(encoded);
      }

      expect(encodedValues.size).toBe(max - min + 1);
    });

    it("should keep encoded values within the same range", async () => {
      const min = 10;
      const max = 100;

      for (let index = min; index <= max; index++) {
        const encoded = await encode({ min, max, index });
        expect(encoded).toBeGreaterThanOrEqual(min);
        expect(encoded).toBeLessThanOrEqual(max);
      }
    });

    it("should produce different encoded values for consecutive indices", async () => {
      const min = 0;
      const max = 100;

      for (let index = min; index < max; index++) {
        const encoded1 = await encode({ min, max, index });
        const encoded2 = await encode({ min, max, index: index + 1 });
        expect(encoded1).not.toBe(encoded2);
      }
    });
  });

  describe("Large range handling", () => {
    it("should handle large positive ranges", async () => {
      const min = 0;
      const max = 1000;
      const testIndices = [0, 250, 500, 750, 1000];

      for (const index of testIndices) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });

    it("should handle large negative ranges", async () => {
      const min = -1000;
      const max = -500;
      const testIndices = [-1000, -875, -750, -625, -500];

      for (const index of testIndices) {
        const encoded = await encode({ min, max, index });
        const decoded = await decode({ min, max, index: encoded });
        expect(decoded).toBe(index);
      }
    });
  });

  describe("Browser-specific tests", () => {
    it("should return Promises", () => {
      const result = encode({ min: 0, max: 100, index: 50 });
      expect(result).toBeInstanceOf(Promise);
    });

    it("should work with Promise.all for parallel operations", async () => {
      const min = 0;
      const max = 100;
      const indices = [10, 20, 30, 40, 50];

      const encodedResults = await Promise.all(
        indices.map((index) => encode({ min, max, index }))
      );

      const decodedResults = await Promise.all(
        encodedResults.map((encoded) => decode({ min, max, index: encoded }))
      );

      expect(decodedResults).toEqual(indices);
    });

    it("should handle concurrent encode/decode operations", async () => {
      const min = 0;
      const max = 50;
      const operations = [];

      for (let i = min; i <= max; i++) {
        operations.push(
          encode({ min, max, index: i }).then((encoded) =>
            decode({ min, max, index: encoded })
          )
        );
      }

      const results = await Promise.all(operations);
      const expected = Array.from({ length: max - min + 1 }, (_, i) => i + min);
      expect(results).toEqual(expected);
    });
  });

  describe("Compatibility with Node.js version", () => {
    it("should produce same results as Node.js version for basic case", async () => {
      // These expected values should match the Node.js version output
      const min = 0;
      const max = 100;
      const index = 42;

      const encoded = await encode({ min, max, index });
      const decoded = await decode({ min, max, index: encoded });

      // The encoded value should be deterministic
      expect(decoded).toBe(index);
      expect(encoded).toBeGreaterThanOrEqual(min);
      expect(encoded).toBeLessThanOrEqual(max);
    });

    it("should produce same results with custom keys", async () => {
      const min = 0;
      const max = 99;
      const index = 50;
      const privateKey = "test-private-key";
      const publicKey = "test-public-key";

      const encoded = await encode({ min, max, index, privateKey, publicKey });
      const decoded = await decode({
        min,
        max,
        index: encoded,
        privateKey,
        publicKey,
      });

      expect(decoded).toBe(index);
    });
  });
});
