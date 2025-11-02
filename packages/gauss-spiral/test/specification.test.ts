import { getCoordinates, getNFromCoordinates } from "../src/index";

type Point = [number, number];

const computeRingPoints = (m: number): Point[] => {
  if (m < 0) return [];
  const limit = Math.ceil(Math.sqrt(m));
  const points: Point[] = [];

  for (let x = -limit; x <= limit; x++) {
    for (let y = -limit; y <= limit; y++) {
      if (x * x + y * y === m) points.push([x, y]);
    }
  }

  return points;
};

const normalizeZero = (value: number): number => (Object.is(value, -0) ? 0 : value);

const countPointsWithinRadius = (m: number): number => {
  if (m < 0) return 0;
  const limit = Math.ceil(Math.sqrt(m));
  let count = 0;

  for (let x = -limit; x <= limit; x++) {
    for (let y = -limit; y <= limit; y++) {
      if (x * x + y * y <= m) count++;
    }
  }

  return count;
};

describe("Gauss spiral specification compliance", () => {
  test("enumerates rings in clockwise angle order up to radius 50", () => {
    const maxM = 50;
    let cumulativeCount = 0;
    const seen = new Set<string>();

    for (let m = 0; m <= maxM; m++) {
      const ringPoints = computeRingPoints(m);
      ringPoints.sort((a, b) => {
        const angleA = Math.atan2(a[1], a[0]);
        const angleB = Math.atan2(b[1], b[0]);
        if (angleA === angleB) {
          if (a[0] !== b[0]) return b[0] - a[0];
          return b[1] - a[1];
        }
        return angleB - angleA;
      });

      ringPoints.forEach(([x, y], index) => {
        const expectedN = cumulativeCount + index + 1;
        const normalizedX = normalizeZero(x);
        const normalizedY = normalizeZero(y);

        const n = getNFromCoordinates(normalizedX, normalizedY);
        expect(n).toBe(expectedN);

        const coords = getCoordinates(expectedN);
        expect(normalizeZero(coords.x)).toBe(normalizedX);
        expect(normalizeZero(coords.y)).toBe(normalizedY);

        const key = `${normalizedX},${normalizedY}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      });

      cumulativeCount += ringPoints.length;
      const expectedTotal = countPointsWithinRadius(m);
      expect(cumulativeCount).toBe(expectedTotal);
    }

    expect(seen.size).toBe(cumulativeCount);
  });

  test("radius is non-decreasing with n for first 500 points", () => {
    let previousRadiusSquared = -1;
    const maxN = 500;
    const seen = new Set<string>();

    for (let n = 1; n <= maxN; n++) {
      const { x, y } = getCoordinates(n);
      const normalizedX = normalizeZero(x);
      const normalizedY = normalizeZero(y);
      const radiusSquared = normalizedX * normalizedX + normalizedY * normalizedY;

      expect(radiusSquared).toBeGreaterThanOrEqual(previousRadiusSquared);
      previousRadiusSquared = radiusSquared;

      const key = `${normalizedX},${normalizedY}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);

      const roundTrip = getNFromCoordinates(normalizedX, normalizedY);
      expect(roundTrip).toBe(n);
    }
  });
});
