import { getNFromCoordinates, getCoordinates } from "../src/index";

describe("Round-trip conversion test", () => {
  test("Converting coordinates to N and back should return original coordinates", () => {
    const testPoints: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [2, 0],
      [0, 2],
      [2, 1],
      [1, 2],
    ];

    testPoints.forEach(([x, y]) => {
      const n = getNFromCoordinates(x, y);
      const result = getCoordinates(n);
      expect(result.x).toBe(x);
      expect(result.y).toBe(y);
    });
  });

  test("Converting N to coordinates and back should return original N", () => {
    const testNValues = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50];

    testNValues.forEach((n) => {
      const coords = getCoordinates(n);
      const resultN = getNFromCoordinates(coords.x, coords.y);
      expect(resultN).toBe(n);
    });
  });

  test("Sequential N values should produce unique coordinates", () => {
    const coordinates = new Set<string>();
    for (let n = 1; n <= 50; n++) {
      const { x, y } = getCoordinates(n);
      const key = `${x},${y}`;
      expect(coordinates.has(key)).toBe(false);
      coordinates.add(key);
    }
  });

  test("All coordinates on same circle should have different N values", () => {
    // Test points on circle m=1
    const pointsM1: [number, number][] = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];

    const nValues = pointsM1.map(([x, y]) => getNFromCoordinates(x, y));
    const uniqueNValues = new Set(nValues);
    expect(uniqueNValues.size).toBe(pointsM1.length);
  });

  test("Round-trip conversion for large N values", () => {
    const largeNValues = [100, 200, 500, 1000];

    largeNValues.forEach((n) => {
      const coords = getCoordinates(n);
      const resultN = getNFromCoordinates(coords.x, coords.y);
      expect(resultN).toBe(n);
    });
  });

  test("Round-trip conversion for points far from origin", () => {
    const farPoints: [number, number][] = [
      [10, 0],
      [0, 10],
      [7, 7],
      [-8, 6],
      [5, -12],
    ];

    farPoints.forEach(([x, y]) => {
      const n = getNFromCoordinates(x, y);
      const result = getCoordinates(n);
      expect(result.x).toBe(x);
      expect(result.y).toBe(y);
    });
  });
});
