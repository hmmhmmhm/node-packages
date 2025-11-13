# gauss-spiral

[![Wiki](https://img.shields.io/badge/📖_Wiki-deepwiki-blue)](https://deepwiki.com/hmmhmmhm/node-packages)

[![Gauss Spiral](https://hmart.app/en/gauss-spiral/og.png)](https://hmart.app/gauss-spiral)

**[🔗 Showcase and Introduction Page](https://hmart.app/gauss-spiral)**

Fill a circle with dots from the center out — efficiently. Compute `(x, y) ↔ n` for very large cases fast (binary search + `O(√m)` counting, `O(log m)` search) with a simple, plug-and-play API — no math background needed.

Utilities to map between an integer spiral's visit order `n` and lattice coordinates `(x, y)` on Z^2.

This is NOT Gauss' circle problem nor a number-theory result. The name is only inspirational: we enumerate integer lattice points by expanding rings and ordering points on each ring by angle.

## Analogy

Imagine painting dots starting at the center pixel `(0, 0)` and expanding outward so that the circle fills up without gaps. This library tells you:

- Given a dot's coordinate `(x, y)`, exactly which turn `n` it was placed.
- Given a step `n`, exactly which coordinate `(x, y)` to paint next.

This is handy for pixel plotting, particle systems, procedural art, or any visualization that needs a deterministic “from center outwards” spiral fill.

## Benefits

- **Deterministic mapping**: Stable, reproducible order for every lattice point.
- **Bidirectional**: Convert both `(x, y) → n` and `n → (x, y)`.
- **Geometry-first**: Simple arithmetic and `atan2` ordering; no heavy number theory.
- **Incremental-friendly**: Great for progressive rendering or streaming updates.
- **Ring sampling**: Easy to iterate points by radius ring for effects and batching.
- **Zero dependencies**: Plain TypeScript/JavaScript, small bundle.

## Practical examples

- **Visual effects / rendering**
  - Progressive radial reveal, spiral particle emission, halo expansion.
  - Iterate `n = 1..N` and plot `getCoordinates(n)`; stop when `x^2 + y^2` exceeds a radius.

  ```typescript
  const maxRadius = 64; // pixels
  for (let n = 1; ; n++) {
    const { x, y } = getCoordinates(n);
    if (x * x + y * y > maxRadius * maxRadius) break;
    plotPixel(centerX + x, centerY + y);
  }
  ```

- **GIS / map tiling**
  - Prioritize fetching tiles around the center tile `(cx, cy)` in spiral order to maximize perceived responsiveness.
  - Use `getCoordinates(n)` as offsets from `(cx, cy)`.

  ```typescript
  // 1) Circular tile prefetch around a focal tile (e.g., user location)
  async function fetchTilesSpiral(cx: number, cy: number, count: number) {
    const tasks: Promise<void>[] = [];
    for (let n = 1; n <= count; n++) {
      const { x, y } = getCoordinates(n); // (dx, dy)
      tasks.push(fetchTile(cx + x, cy + y));
    }
    await Promise.allSettled(tasks);
  }

  // 2) Drone/robot next-search waypoints (expand search radius while staying coverage-optimal)
  function* droneWaypoints(cx: number, cy: number) {
    for (let n = 1; ; n++) {
      const { x, y } = getCoordinates(n);
      yield { latIndex: cy + y, lonIndex: cx + x };
    }
  }

  // 3) Military/operations coordinate prioritization (rank tasks by circular proximity)
  //    Known target deltas (dx, dy) can be ranked by getNFromCoordinates(dx, dy).
  targets.sort((a, b) => getNFromCoordinates(a.dx, a.dy) - getNFromCoordinates(b.dx, b.dy));
  ```

- **Games / chunk visibility & loading**
  - Load chunks around the player in a circle-first fashion to avoid diamond- or square-shaped artifacts.
  - Either compute loading order with `getCoordinates(n)` or assign priority to known chunks via `getNFromCoordinates(dx, dy)`.

  ```typescript
  const maxChunks = 256;
  for (let n = 1; n <= maxChunks; n++) {
    const { x, y } = getCoordinates(n);
    queueLoadChunk(player.cx + x, player.cy + y);
  }

  // Or rank existing chunk deltas by priority index:
  chunks.sort((a, b) => getNFromCoordinates(a.dx, a.dy) - getNFromCoordinates(b.dx, b.dy));
  ```

## Installation

```bash
npm install gauss-spiral
```

## Usage

### Gauss Spiral Coordinates

```typescript
import { getNFromCoordinates, getCoordinates } from 'gauss-spiral';

// n from (x, y): how many-th visit is this point in the spiral?
const n = getNFromCoordinates(2, 3);
console.log(n); // e.g. 47 (depends on the spiral's ordering)

// (x, y) from n: which coordinate is visited at step n?
const coords = getCoordinates(10);
console.log(coords); // { x: number, y: number }
```

### Spherical Coordinate Grid System

The library also provides utilities for converting geographic coordinates (latitude/longitude) into a grid-based diff system, useful for spatial indexing and proximity calculations.

```typescript
import {
  calculateCoordinateDiff,
  reconstructCoordinateDiff,
  DEG_PER_METER,
} from 'gauss-spiral';

// Define a center point (e.g., Seoul, South Korea)
const center = { lat: 37.5665, lng: 126.978 };

// Define a target location
const target = { lat: 37.5695, lng: 126.981 };

// Convert to grid diff with 3-meter precision
const diff = calculateCoordinateDiff({
  center,
  target,
  precisionMeters: 3,
});
console.log(diff); // { lat: 111, lng: 237 } (approximate grid indices)

// Reconstruct the original coordinates from the diff
const reconstructed = reconstructCoordinateDiff({
  center,
  diff,
  precisionMeters: 3,
});
console.log(reconstructed); // Close to original target coordinates

// Use with Gauss spiral for radial proximity search
const spiralN = getNFromCoordinates(diff.lat, diff.lng);
console.log(spiralN); // Priority index for this location
```

**Use cases for spherical coordinate utilities:**

- **Geospatial indexing**: Convert lat/lng to integer grid indices for efficient spatial queries
- **Proximity search**: Combine with Gauss spiral to prioritize locations by distance from center
- **Map tile systems**: Create custom grid systems with configurable precision
- **Location-based services**: Implement radius-based searches and nearest-neighbor queries
- **Geohashing alternative**: Simple grid-based spatial indexing without external dependencies

## What this is

- **Problem**: When plotting integer points outward from the origin in an ever-growing spiral, determine
  - `n` for a given `(x, y)` (index of visit), and
  - `(x, y)` for a given `n` (coordinate visited at step n).
- **Approach**: We group points by their squared radius `m = x^2 + y^2` (concentric “rings”). Within each ring, points are ordered by the polar angle `atan2(y, x)` in clockwise order. The global index `n` is the cumulative count of all points with smaller `m` plus the position within the current ring.

## Algorithm overview

- **Rings**: For each integer `m ≥ 0`, the ring contains all integer solutions of `x^2 + y^2 = m`.
- **Order within a ring**: Sort solutions by `atan2(y, x)` descending (clockwise). Ties are stable and deterministic.
- **Global index**:
  - Let `S(m)` be the number of integer points with `x^2 + y^2 ≤ m`.
  - Then for `(x, y)` with `x^2 + y^2 = m`, `n = S(m-1) + k`, where `k` is the 1-based position in the ring.
- **Inverse (n → (x, y))**:
  - Binary-search the smallest `m` with `S(m) ≥ n`.
  - Set `k = n - S(m-1)` and return the `k`-th point of the ring ordered as above.

## API

### Gauss Spiral Functions

#### `getNFromCoordinates(x: number, y: number): number`

Returns the 1-based visit index `n` of `(x, y)` in the spiral enumeration.

**Parameters:**
- `x` - The x-coordinate
- `y` - The y-coordinate

**Returns:** The index `n (≥ 1)`

#### `getCoordinates(n: number): { x: number; y: number }`

Returns the lattice coordinate visited at step `n`.

**Parameters:**
- `n` - The N value (must be > 0)

**Returns:** `{ x, y }`

**Throws:** Error if n <= 0

### Spherical Coordinate Functions

#### `calculateCoordinateDiff(options): { lat: number; lng: number }`

Converts a target coordinate to a grid diff based on a reference center coordinate. Useful for creating a grid-based spatial indexing system.

**Parameters:**
- `options.center` - The reference coordinate `{ lat: number, lng: number }`
- `options.target` - The target coordinate to convert `{ lat: number, lng: number }`
- `options.precisionMeters` - (Optional) The precision in meters for the conversion. Default: `3`
- `options.degreePerMeter` - (Optional) Conversion factor from meters to degrees. Default: `111000`

**Returns:** `{ lat: number, lng: number }` - The calculated grid diff for latitude and longitude

**Example:**
```typescript
const diff = calculateCoordinateDiff({
  center: { lat: 37.5665, lng: 126.978 },
  target: { lat: 37.5695, lng: 126.981 },
  precisionMeters: 3,
});
```

#### `reconstructCoordinateDiff(options): { lat: number; lng: number }`

Converts a grid diff back into a coordinate based on a reference center coordinate. This reverses the operation done by `calculateCoordinateDiff`.

**Parameters:**
- `options.center` - The reference coordinate `{ lat: number, lng: number }`
- `options.diff` - The grid diff representing the position `{ lat: number, lng: number }`
- `options.precisionMeters` - (Optional) The precision in meters used in the conversion. Default: `3`
- `options.degreePerMeter` - (Optional) Conversion factor from meters to degrees. Default: `111000`

**Returns:** `{ lat: number, lng: number }` - The calculated target coordinate

**Example:**
```typescript
const reconstructed = reconstructCoordinateDiff({
  center: { lat: 37.5665, lng: 126.978 },
  diff: { lat: 111, lng: 237 },
  precisionMeters: 3,
});
```

#### `DEG_PER_METER`

Constant representing the approximate conversion factor from degrees to meters. Approximately 111,000 meters corresponds to 1 degree of latitude.

**Value:** `111000`

## Performance notes

- Counting `S(m)` is implemented in `O(√m)` using symmetry to aggregate lattice points per `x`.
- `n → (x, y)` uses a binary search on `m` around an initial guess and then sorts only the ring points for that `m`.

## Caveats

- The ordering within each ring is purely geometric (by angle), not arithmetic. It does not encode primes, quadratic residues, or Gauss’ circle estimates.
- The origin `(0, 0)` is defined as `n = 1`.

## License

MIT
