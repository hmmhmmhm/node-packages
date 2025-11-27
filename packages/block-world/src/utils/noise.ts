export class SimplexNoise {
  private p: Uint8Array
  private perm: Uint8Array
  private permMod12: Uint8Array
  private grad3: number[][]
  private F2: number
  private G2: number
  private F3: number
  private G3: number

  constructor(seed: number = Math.random()) {
    this.p = new Uint8Array(256)
    this.perm = new Uint8Array(512)
    this.permMod12 = new Uint8Array(512)

    for (let i = 0; i < 256; i++) {
      this.p[i] = i
    }

    let n: number, q: number
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647
      n = seed % (i + 1)
      q = this.p[i]
      this.p[i] = this.p[n]
      this.p[n] = q
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255]
      this.permMod12[i] = this.perm[i] % 12
    }

    this.grad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1],
    ]

    this.F2 = 0.5 * (Math.sqrt(3) - 1)
    this.G2 = (3 - Math.sqrt(3)) / 6
    this.F3 = 1 / 3
    this.G3 = 1 / 6
  }

  noise2D(xin: number, yin: number): number {
    let n0: number, n1: number, n2: number
    const s = (xin + yin) * this.F2
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const t = (i + j) * this.G2
    const X0 = i - t
    const Y0 = j - t
    const x0 = xin - X0
    const y0 = yin - Y0

    let i1: number, j1: number
    if (x0 > y0) {
      i1 = 1
      j1 = 0
    } else {
      i1 = 0
      j1 = 1
    }

    const x1 = x0 - i1 + this.G2
    const y1 = y0 - j1 + this.G2
    const x2 = x0 - 1 + 2 * this.G2
    const y2 = y0 - 1 + 2 * this.G2

    const ii = i & 255
    const jj = j & 255
    const gi0 = this.permMod12[ii + this.perm[jj]]
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]]
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]]

    let t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 < 0) {
      n0 = 0
    } else {
      t0 *= t0
      n0 = t0 * t0 * this.dot2(this.grad3[gi0], x0, y0)
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 < 0) {
      n1 = 0
    } else {
      t1 *= t1
      n1 = t1 * t1 * this.dot2(this.grad3[gi1], x1, y1)
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 < 0) {
      n2 = 0
    } else {
      t2 *= t2
      n2 = t2 * t2 * this.dot2(this.grad3[gi2], x2, y2)
    }

    return 70 * (n0 + n1 + n2)
  }

  noise3D(xin: number, yin: number, zin: number): number {
    let n0: number, n1: number, n2: number, n3: number
    const s = (xin + yin + zin) * this.F3
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const k = Math.floor(zin + s)
    const t = (i + j + k) * this.G3
    const X0 = i - t
    const Y0 = j - t
    const Z0 = k - t
    const x0 = xin - X0
    const y0 = yin - Y0
    const z0 = zin - Z0

    let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1
        j1 = 0
        k1 = 0
        i2 = 1
        j2 = 1
        k2 = 0
      } else if (x0 >= z0) {
        i1 = 1
        j1 = 0
        k1 = 0
        i2 = 1
        j2 = 0
        k2 = 1
      } else {
        i1 = 0
        j1 = 0
        k1 = 1
        i2 = 1
        j2 = 0
        k2 = 1
      }
    } else {
      if (y0 < z0) {
        i1 = 0
        j1 = 0
        k1 = 1
        i2 = 0
        j2 = 1
        k2 = 1
      } else if (x0 < z0) {
        i1 = 0
        j1 = 1
        k1 = 0
        i2 = 0
        j2 = 1
        k2 = 1
      } else {
        i1 = 0
        j1 = 1
        k1 = 0
        i2 = 1
        j2 = 1
        k2 = 0
      }
    }

    const x1 = x0 - i1 + this.G3
    const y1 = y0 - j1 + this.G3
    const z1 = z0 - k1 + this.G3
    const x2 = x0 - i2 + 2 * this.G3
    const y2 = y0 - j2 + 2 * this.G3
    const z2 = z0 - k2 + 2 * this.G3
    const x3 = x0 - 1 + 3 * this.G3
    const y3 = y0 - 1 + 3 * this.G3
    const z3 = z0 - 1 + 3 * this.G3

    const ii = i & 255
    const jj = j & 255
    const kk = k & 255
    const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]]
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]]
    const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]]
    const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]]

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    n0 = t0 < 0 ? 0 : ((t0 *= t0), t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0))

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    n1 = t1 < 0 ? 0 : ((t1 *= t1), t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1))

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    n2 = t2 < 0 ? 0 : ((t2 *= t2), t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2))

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    n3 = t3 < 0 ? 0 : ((t3 *= t3), t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3))

    return 32 * (n0 + n1 + n2 + n3)
  }

  private dot2(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y
  }

  private dot3(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z
  }

  octaveNoise2D(
    x: number,
    y: number,
    octaves: number,
    persistence: number,
    scale: number
  ): number {
    let total = 0
    let frequency = scale
    let amplitude = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude
      maxValue += amplitude
      amplitude *= persistence
      frequency *= 2
    }

    return total / maxValue
  }
}
