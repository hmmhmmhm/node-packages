# gauss-spiral

[![Wiki](https://img.shields.io/badge/📖_Wiki-deepwiki-blue)](https://deepwiki.com/hmmhmmhm/node-packages)

[![Gauss Spiral](https://hmart.app/ko/gauss-spiral/og.png)](https://hmart.app/ko/gauss-spiral)

**[🔗 Showcase and Introduction Page](https://hmart.app/ko/gauss-spiral)**

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

```typescript
import { getNFromCoordinates, getCoordinates } from 'gauss-spiral';

// n from (x, y): how many-th visit is this point in the spiral?
const n = getNFromCoordinates(2, 3);
console.log(n); // e.g. 47 (depends on the spiral's ordering)

// (x, y) from n: which coordinate is visited at step n?
const coords = getCoordinates(10);
console.log(coords); // { x: number, y: number }
```

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

### `getNFromCoordinates(x: number, y: number): number`

Returns the 1-based visit index `n` of `(x, y)` in the spiral enumeration.

**Parameters:**
- `x` - The x-coordinate
- `y` - The y-coordinate

**Returns:** The index `n (≥ 1)`

### `getCoordinates(n: number): { x: number; y: number }`

Returns the lattice coordinate visited at step `n`.

**Parameters:**
- `n` - The N value (must be > 0)

**Returns:** `{ x, y }`

**Throws:** Error if n <= 0

## Performance notes

- Counting `S(m)` is implemented in `O(√m)` using symmetry to aggregate lattice points per `x`.
- `n → (x, y)` uses a binary search on `m` around an initial guess and then sorts only the ring points for that `m`.

## Caveats

- The ordering within each ring is purely geometric (by angle), not arithmetic. It does not encode primes, quadratic residues, or Gauss’ circle estimates.
- The origin `(0, 0)` is defined as `n = 1`.

## License

MIT
