/**
 * Calculates the N value from the given x and y coordinates.
 *
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {number} The N value.
 */
export const getNFromCoordinates = (x: number, y: number): number => {
  // Direct return for origin (0, 0)
  if (x === 0 && y === 0) return 1;

  // Calculate the squared sum of coordinates
  const m = x * x + y * y;

  // Calculate countLatticePoints(m-1) to find offset
  const s_m_minus_1 = m > 0 ? countLatticePoints(m - 1) : 0;

  // Retrieve all lattice points on the circle x^2 + y^2 = m
  const points = getPoints(m);
  let count = 0;

  // Count how many points have a greater angle
  for (const [px, py] of points) if (isAngleGreater(px, py, x, y)) count++;

  const k = count + 1;

  // Return the computed index n
  return s_m_minus_1 + k;
};

/**
 * Calculates the coordinates from the given N value.
 *
 * @param {number} n - The N value.
 * @returns {{ x: number; y: number }} The coordinates {x, y}.
 */
export const getCoordinates = (n: number): { x: number; y: number } => {
  if (n <= 0) throw new Error("Invalid value for n.");
  if (n === 1) return { x: 0, y: 0 };

  // Approximate m by using n
  const approx_m = Math.floor(n / Math.PI);
  // Define delta to narrow down the search range
  const delta = Math.ceil(Math.sqrt(n));

  // Binary search to find the smallest m where s(m) >= n
  let low = Math.max(0, approx_m - delta);
  let high = approx_m + delta;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (countLatticePoints(mid) < n) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  const m = low;

  // Calculate s(m-1) to determine the offset
  const s_m_minus_1 = m > 0 ? countLatticePoints(m - 1) : 0;
  const k = n - s_m_minus_1;

  // Get list of points where x^2 + y^2 = m
  const points = getPoints(m);

  // Sort the points in descending order of angles (clockwise)
  points.sort((a, b) => {
    const angleA = Math.atan2(a[1], a[0]);
    const angleB = Math.atan2(b[1], b[0]);
    return angleB - angleA; // Sort clockwise
  });

  // Return the k-th point
  const [x, y] = points[k - 1]!;
  return { x, y };
};

/**
 * Calculates the number of lattice points where x^2 + y^2 <= m (optimized version)
 *
 * @param {number} m - The value m.
 * @returns {number} The number of lattice points.
 */
function countLatticePoints(m: number): number {
  if (m < 0) return 0;
  const r = Math.floor(Math.sqrt(m));
  let count = 0;
  for (let x = 0; x <= r; x++) {
    const temp = m - x * x;
    if (temp < 0) continue;
    const k = Math.floor(Math.sqrt(temp));
    count += (x === 0 ? 1 : 2) * (2 * k + 1); // Twice for symmetry around the x-axis, once at x = 0
  }
  return count;
}

/**
 * Generates a list of points where x^2 + y^2 = m
 *
 * @param {number} m - The value m.
 * @returns {[number, number][]} The list of points.
 */
function getPoints(m: number): [number, number][] {
  const points: [number, number][] = [];
  const r = Math.floor(Math.sqrt(m));
  for (let x = -r; x <= r; x++) {
    const temp = m - x * x;
    if (temp < 0) continue;
    const k = Math.floor(Math.sqrt(temp));
    if (k * k === temp) {
      if (k > 0) {
        points.push([x, k]);
        points.push([x, -k]);
      } else {
        points.push([x, 0]);
      }
    }
  }
  return points;
}

/**
 * Compares two points using their cross product for deterministic ordering.
 *
 * @param {number} px - The x-coordinate of the first point.
 * @param {number} py - The y-coordinate of the first point.
 * @param {number} x - The x-coordinate of the second point.
 * @param {number} y - The y-coordinate of the second point.
 * @returns {boolean} True if the angle of the first point is greater than the second point, false otherwise.
 */
function isAngleGreater(px: number, py: number, x: number, y: number): boolean {
  const atan2A = Math.atan2(py, px);
  const atan2B = Math.atan2(y, x);
  if (atan2A === atan2B) return false;
  return atan2A > atan2B;
}
