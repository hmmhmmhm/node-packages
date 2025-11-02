import { getCoordinates } from "../src/index";

describe("getCoordinates function test", () => {
  test("N=1 should return origin (0, 0)", () => {
    const result = getCoordinates(1);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  test("N=2 should return a valid point on circle m=1", () => {
    const result = getCoordinates(2);
    const m = result.x * result.x + result.y * result.y;
    expect(m).toBe(1);
  });

  test("N=3 should return a valid point on circle m=1", () => {
    const result = getCoordinates(3);
    const m = result.x * result.x + result.y * result.y;
    expect(m).toBe(1);
  });

  test("N=4 should return a valid point on circle m=1", () => {
    const result = getCoordinates(4);
    const m = result.x * result.x + result.y * result.y;
    expect(m).toBe(1);
  });

  test("N=5 should return a valid point on circle m=1", () => {
    const result = getCoordinates(5);
    const m = result.x * result.x + result.y * result.y;
    expect(m).toBe(1);
  });

  test("Points for N=6 to N=9 should be on circle m=2", () => {
    for (let n = 6; n <= 9; n++) {
      const result = getCoordinates(n);
      const m = result.x * result.x + result.y * result.y;
      expect(m).toBe(2);
    }
  });

  test("Should return integer coordinates", () => {
    const testValues = [1, 2, 5, 10, 15, 20];
    testValues.forEach((n) => {
      const result = getCoordinates(n);
      expect(Number.isInteger(result.x)).toBe(true);
      expect(Number.isInteger(result.y)).toBe(true);
    });
  });

  test("Should throw error for invalid N values", () => {
    expect(() => getCoordinates(0)).toThrow("Invalid value for n.");
    expect(() => getCoordinates(-1)).toThrow("Invalid value for n.");
    expect(() => getCoordinates(-10)).toThrow("Invalid value for n.");
  });

  test("Large N values should work correctly", () => {
    const result = getCoordinates(100);
    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");
    expect(Number.isInteger(result.x)).toBe(true);
    expect(Number.isInteger(result.y)).toBe(true);
  });

  test("Coordinates should satisfy the lattice point condition", () => {
    const testValues = [1, 5, 10, 20, 30, 50];
    testValues.forEach((n) => {
      const result = getCoordinates(n);
      const m = result.x * result.x + result.y * result.y;
      // m should be a non-negative integer
      expect(m).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(m)).toBe(true);
    });
  });
});
