import { getNFromCoordinates } from "../src/index";

describe("getNFromCoordinates function test", () => {
  test("Origin point (0, 0) should return 1", () => {
    expect(getNFromCoordinates(0, 0)).toBe(1);
  });

  test("Points on the first circle (m=1)", () => {
    // Points where x^2 + y^2 = 1
    expect(getNFromCoordinates(1, 0)).toBeGreaterThan(1);
    expect(getNFromCoordinates(0, 1)).toBeGreaterThan(1);
    expect(getNFromCoordinates(-1, 0)).toBeGreaterThan(1);
    expect(getNFromCoordinates(0, -1)).toBeGreaterThan(1);
  });

  test("Points on the second circle (m=2)", () => {
    // Points where x^2 + y^2 = 2
    expect(getNFromCoordinates(1, 1)).toBeGreaterThan(1);
    expect(getNFromCoordinates(1, -1)).toBeGreaterThan(1);
    expect(getNFromCoordinates(-1, 1)).toBeGreaterThan(1);
    expect(getNFromCoordinates(-1, -1)).toBeGreaterThan(1);
  });

  test("Points on larger circles", () => {
    // Points where x^2 + y^2 = 4
    expect(getNFromCoordinates(2, 0)).toBeGreaterThan(1);
    expect(getNFromCoordinates(0, 2)).toBeGreaterThan(1);
    expect(getNFromCoordinates(-2, 0)).toBeGreaterThan(1);
    expect(getNFromCoordinates(0, -2)).toBeGreaterThan(1);
  });

  test("Points on circle m=5", () => {
    // Points where x^2 + y^2 = 5
    expect(getNFromCoordinates(2, 1)).toBeGreaterThan(1);
    expect(getNFromCoordinates(1, 2)).toBeGreaterThan(1);
    expect(getNFromCoordinates(-1, 2)).toBeGreaterThan(1);
    expect(getNFromCoordinates(-2, 1)).toBeGreaterThan(1);
  });

  test("Different points should have different N values", () => {
    const n1 = getNFromCoordinates(1, 0);
    const n2 = getNFromCoordinates(0, 1);
    const n3 = getNFromCoordinates(-1, 0);
    const n4 = getNFromCoordinates(0, -1);

    // All should be unique
    const values = [n1, n2, n3, n4];
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  test("N values should be positive integers", () => {
    const testPoints = [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 0],
    ];

    testPoints.forEach(([x, y]) => {
      const n = getNFromCoordinates(x, y);
      expect(n).toBeGreaterThan(0);
      expect(Number.isInteger(n)).toBe(true);
    });
  });
});
