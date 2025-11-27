import { SimplexNoise } from '../utils/noise'
import { BlockType } from '../types'
import {
  CHUNK_SIZE,
  CHUNK_HEIGHT,
  WATER_LEVEL,
  TREE_DENSITY,
} from '../constants'

export class WorldGenerator {
  private noise: SimplexNoise

  constructor(seed: number = 12345) {
    this.noise = new SimplexNoise(seed)
  }

  generateChunk(cx: number, cz: number): Uint8Array {
    const chunkData = new Uint8Array(CHUNK_SIZE * CHUNK_HEIGHT * CHUNK_SIZE)

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = cx * CHUNK_SIZE + x
        const worldZ = cz * CHUNK_SIZE + z

        const baseHeight = 20
        const mountainNoise = this.noise.octaveNoise2D(worldX, worldZ, 4, 0.5, 0.01)
        const hillNoise = this.noise.octaveNoise2D(worldX, worldZ, 3, 0.5, 0.03)
        const detailNoise = this.noise.octaveNoise2D(worldX, worldZ, 2, 0.5, 0.1)

        const height = Math.floor(
          baseHeight + mountainNoise * 15 + hillNoise * 8 + detailNoise * 3
        )

        const biomeNoise = this.noise.noise2D(worldX * 0.005, worldZ * 0.005)
        const isDesert = biomeNoise > 0.4
        const isSnowy = biomeNoise < -0.4

        for (let y = 0; y < CHUNK_HEIGHT; y++) {
          const index = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT

          if (y === 0) {
            chunkData[index] = BlockType.BEDROCK
          } else if (y < height - 4) {
            const caveNoise = this.noise.noise3D(worldX * 0.05, y * 0.05, worldZ * 0.05)
            if (caveNoise > 0.6 && y > 5) {
              chunkData[index] = BlockType.AIR
            } else {
              const oreChance = Math.random()
              if (y < 12 && oreChance < 0.005) {
                chunkData[index] = BlockType.DIAMOND_ORE
              } else if (y < 20 && oreChance < 0.01) {
                chunkData[index] = BlockType.GOLD_ORE
              } else if (y < 40 && oreChance < 0.02) {
                chunkData[index] = BlockType.IRON_ORE
              } else if (oreChance < 0.03) {
                chunkData[index] = BlockType.COAL_ORE
              } else {
                chunkData[index] = BlockType.STONE
              }
            }
          } else if (y < height) {
            chunkData[index] = isDesert ? BlockType.SAND : BlockType.DIRT
          } else if (y === height) {
            if (y <= WATER_LEVEL + 1) {
              chunkData[index] = BlockType.SAND
            } else if (isDesert) {
              chunkData[index] = BlockType.SAND
            } else if (isSnowy) {
              chunkData[index] = BlockType.SNOW
            } else {
              chunkData[index] = BlockType.GRASS
            }
          } else if (y <= WATER_LEVEL) {
            chunkData[index] = BlockType.WATER
          } else {
            // Chance to spawn bush on grass
            if (
              y === height + 1 &&
              chunkData[index - CHUNK_SIZE] === BlockType.GRASS
            ) {
              const foliageRng = Math.random()
              if (foliageRng < 0.10) {
                chunkData[index] = BlockType.BUSH
              } else if (foliageRng < 0.12) {
                chunkData[index] = BlockType.RED_FLOWER
              } else if (foliageRng < 0.14) {
                chunkData[index] = BlockType.YELLOW_FLOWER
              } else {
                chunkData[index] = BlockType.AIR
              }
            } else {
              chunkData[index] = BlockType.AIR
            }
          }
        }
      }
    }

    this.generateTrees(cx, cz, chunkData)
    this.generatePalmTrees(cx, cz, chunkData)
    this.generateCacti(cx, cz, chunkData)
    return chunkData
  }

  private generatePalmTrees(cx: number, cz: number, chunkData: Uint8Array) {
    const rng = new SimplexNoise(cx * 3000 + cz)

    // Increased margin to 4 to handle wider palm leaves
    for (let x = 4; x < CHUNK_SIZE - 4; x++) {
      for (let z = 4; z < CHUNK_SIZE - 4; z++) {
        const worldX = cx * CHUNK_SIZE + x
        const worldZ = cz * CHUNK_SIZE + z

        const biomeNoise = this.noise.noise2D(worldX * 0.005, worldZ * 0.005)
        const isDesert = biomeNoise > 0.4

        if (isDesert) {
          // Very Sparse
          if (rng.noise2D(worldX * 0.5, worldZ * 0.5) > 0.96) {
            for (let y = CHUNK_HEIGHT - 10; y > WATER_LEVEL; y--) {
              const index = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
              if (chunkData[index] === BlockType.SAND) {
                // Found surface sand
                const height = Math.floor(Math.random() * 3) + 6 // 6 to 8 blocks high

                // Check clearance
                let canBuild = true
                for (let h = 1; h <= height + 3; h++) {
                  if (y + h >= CHUNK_HEIGHT) { canBuild = false; break; }
                  const checkIndex = x + (y + h) * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
                  if (chunkData[checkIndex] !== BlockType.AIR) { canBuild = false; break; }
                }

                if (canBuild) {
                  // Build Trunk
                  for (let h = 1; h <= height; h++) {
                    const trunkIndex = x + (y + h) * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
                    chunkData[trunkIndex] = BlockType.PALM_WOOD
                  }

                  // Build Leaves (Longer, drooping fronds)
                  const topY = y + height

                  // Helper to set leaf if air
                  const setLeaf = (lx: number, ly: number, lz: number) => {
                    if (lx >= 0 && lx < CHUNK_SIZE && lz >= 0 && lz < CHUNK_SIZE && ly >= 0 && ly < CHUNK_HEIGHT) {
                      const idx = lx + ly * CHUNK_SIZE + lz * CHUNK_SIZE * CHUNK_HEIGHT
                      if (chunkData[idx] === BlockType.AIR) {
                        chunkData[idx] = BlockType.PALM_LEAVES
                      }
                    }
                  }

                  // Center Top
                  setLeaf(x, topY + 1, z) // Extra top leaf to cover wood

                  // Cardinal Directions (Longer)
                  const cardinals = [[1, 0], [-1, 0], [0, 1], [0, -1]]
                  cardinals.forEach(([dx, dz]) => {
                    setLeaf(x + dx, topY, z + dz)           // r=1, y
                    setLeaf(x + dx * 2, topY, z + dz * 2)   // r=2, y
                    setLeaf(x + dx * 3, topY - 1, z + dz * 3) // r=3, y-1
                    setLeaf(x + dx * 4, topY - 2, z + dz * 4) // r=4, y-2
                  })

                  // Diagonal Directions (Shorter but drooping)
                  const diags = [[1, 1], [-1, 1], [1, -1], [-1, -1]]
                  diags.forEach(([dx, dz]) => {
                    setLeaf(x + dx, topY, z + dz)           // r=1, y
                    setLeaf(x + dx * 2, topY - 1, z + dz * 2) // r=2, y-1
                    setLeaf(x + dx * 3, topY - 2, z + dz * 3) // r=3, y-2
                  })
                }
                break // Done with this column
              } else if (chunkData[index] !== BlockType.AIR && chunkData[index] !== BlockType.CACTUS) {
                break
              }
            }
          }
        }
      }
    }
  }

  private generateCacti(cx: number, cz: number, chunkData: Uint8Array) {
    const rng = new SimplexNoise(cx * 2000 + cz)

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = cx * CHUNK_SIZE + x
        const worldZ = cz * CHUNK_SIZE + z

        // Re-check biome to only spawn in deserts
        const biomeNoise = this.noise.noise2D(worldX * 0.005, worldZ * 0.005)
        const isDesert = biomeNoise > 0.4

        if (isDesert) {
          // Sparse placement
          if (rng.noise2D(worldX * 0.8, worldZ * 0.8) > 0.90) { // Increased from 0.95
            // Find surface
            for (let y = CHUNK_HEIGHT - 5; y > WATER_LEVEL; y--) {
              const index = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
              const block = chunkData[index]

              if (block === BlockType.SAND) {
                // Found sand, place cactus
                const height = Math.floor(Math.random() * 3) + 1 // 1 to 3 blocks high

                for (let h = 1; h <= height; h++) {
                  if (y + h < CHUNK_HEIGHT) {
                    const cactusIndex = x + (y + h) * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
                    // Only place if air
                    if (chunkData[cactusIndex] === BlockType.AIR) {
                      chunkData[cactusIndex] = BlockType.CACTUS
                    }
                  }
                }
                break // Stop after placing one cactus column
              } else if (block !== BlockType.AIR && block !== BlockType.CACTUS) {
                // Hit something else (water, stone, etc), stop searching this column
                break
              }
            }
          }
        }
      }
    }
  }

  private generateTrees(cx: number, cz: number, chunkData: Uint8Array) {
    const treeRng = new SimplexNoise(cx * 1000 + cz)

    for (let x = 2; x < CHUNK_SIZE - 2; x++) {
      for (let z = 2; z < CHUNK_SIZE - 2; z++) {
        const worldX = cx * CHUNK_SIZE + x
        const worldZ = cz * CHUNK_SIZE + z

        const treeNoise = treeRng.noise2D(worldX * 0.5, worldZ * 0.5)

        if (treeNoise > 1 - TREE_DENSITY * 2) {
          for (let y = CHUNK_HEIGHT - 10; y >= WATER_LEVEL; y--) {
            const index = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
            const block = chunkData[index]

            if (block === BlockType.GRASS) {
              const treeHeight = Math.floor(Math.random() * 3) + 4

              let canPlace = true
              for (let ty = 1; ty <= treeHeight + 2; ty++) {
                if (y + ty >= CHUNK_HEIGHT) {
                  canPlace = false
                  break
                }
                const checkIndex = x + (y + ty) * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
                if (chunkData[checkIndex] !== BlockType.AIR) {
                  canPlace = false
                  break
                }
              }

              if (canPlace) {
                for (let ty = 1; ty <= treeHeight; ty++) {
                  const trunkIndex = x + (y + ty) * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
                  chunkData[trunkIndex] = BlockType.WOOD
                }

                for (let ly = treeHeight - 1; ly <= treeHeight + 2; ly++) {
                  const radius = ly <= treeHeight ? 2 : 1
                  for (let lx = -radius; lx <= radius; lx++) {
                    for (let lz = -radius; lz <= radius; lz++) {
                      if (lx === 0 && lz === 0 && ly <= treeHeight) continue
                      if (
                        Math.abs(lx) === radius &&
                        Math.abs(lz) === radius &&
                        Math.random() > 0.5
                      )
                        continue

                      const leafX = x + lx
                      const leafY = y + ly
                      const leafZ = z + lz

                      if (
                        leafX >= 0 &&
                        leafX < CHUNK_SIZE &&
                        leafY >= 0 &&
                        leafY < CHUNK_HEIGHT &&
                        leafZ >= 0 &&
                        leafZ < CHUNK_SIZE
                      ) {
                        const leafIndex =
                          leafX + leafY * CHUNK_SIZE + leafZ * CHUNK_SIZE * CHUNK_HEIGHT
                        if (chunkData[leafIndex] === BlockType.AIR) {
                          chunkData[leafIndex] = BlockType.LEAVES
                        }
                      }
                    }
                  }
                }
              }
              break
            } else if (block !== BlockType.AIR && block !== BlockType.WATER) {
              break
            }
          }
        }
      }
    }
  }
}

export function getChunkKey(cx: number, cz: number): string {
  return `${cx},${cz}`
}

export function worldToChunk(x: number, z: number): { cx: number; cz: number } {
  return {
    cx: Math.floor(x / CHUNK_SIZE),
    cz: Math.floor(z / CHUNK_SIZE),
  }
}

export function getBlockIndex(x: number, y: number, z: number): number {
  return x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_HEIGHT
}

export function getBlock(
  worldX: number,
  worldY: number,
  worldZ: number,
  chunks: Map<string, Uint8Array>
): BlockType {
  if (worldY < 0 || worldY >= CHUNK_HEIGHT) return BlockType.AIR

  const { cx, cz } = worldToChunk(worldX, worldZ)
  const key = getChunkKey(cx, cz)
  const chunkData = chunks.get(key)

  if (!chunkData) return BlockType.AIR

  const localX = ((worldX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
  const localZ = ((worldZ % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE

  return chunkData[getBlockIndex(localX, worldY, localZ)]
}

export function setBlock(
  worldX: number,
  worldY: number,
  worldZ: number,
  blockType: BlockType,
  chunks: Map<string, Uint8Array>
): boolean {
  if (worldY < 0 || worldY >= CHUNK_HEIGHT) return false

  const { cx, cz } = worldToChunk(worldX, worldZ)
  const key = getChunkKey(cx, cz)
  const chunkData = chunks.get(key)

  if (!chunkData) return false

  const localX = ((worldX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
  const localZ = ((worldZ % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE

  chunkData[getBlockIndex(localX, worldY, localZ)] = blockType

  return true
}

export function getChunksInRadius(
  centerCx: number,
  centerCz: number,
  radius: number
): Array<{ cx: number; cz: number; dist: number }> {
  const chunks: Array<{ cx: number; cz: number; dist: number }> = []

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist <= radius) {
        chunks.push({ cx: centerCx + dx, cz: centerCz + dz, dist })
      }
    }
  }

  return chunks.sort((a, b) => a.dist - b.dist)
}
