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
    return chunkData
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
