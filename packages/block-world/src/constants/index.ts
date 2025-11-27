import { BlockType } from '../types'

export const CHUNK_SIZE = 16
export const CHUNK_HEIGHT = 64
export const RENDER_DISTANCE = 8
export const BLOCK_SIZE = 1
export const GRAVITY = -25
export const JUMP_FORCE = 9
export const PLAYER_HEIGHT = 1.8
export const PLAYER_WIDTH = 0.6
export const MOVE_SPEED = 5
export const FLY_SPEED = 10
export const MOUSE_SENSITIVITY = 0.002
export const WATER_LEVEL = 12
export const TREE_DENSITY = 0.08

export const BlockNames: Record<BlockType, string> = {
  [BlockType.AIR]: 'Air',
  [BlockType.GRASS]: 'Grass',
  [BlockType.DIRT]: 'Dirt',
  [BlockType.STONE]: 'Stone',
  [BlockType.SAND]: 'Sand',
  [BlockType.WATER]: 'Water',
  [BlockType.WOOD]: 'Wood',
  [BlockType.LEAVES]: 'Leaves',
  [BlockType.COBBLESTONE]: 'Cobblestone',
  [BlockType.PLANKS]: 'Planks',
  [BlockType.CRAFTING_TABLE]: 'Crafting Table',
  [BlockType.BEDROCK]: 'Bedrock',
  [BlockType.GLASS]: 'Glass',
  [BlockType.BRICK]: 'Brick',
  [BlockType.COAL_ORE]: 'Coal Ore',
  [BlockType.IRON_ORE]: 'Iron Ore',
  [BlockType.GOLD_ORE]: 'Gold Ore',
  [BlockType.DIAMOND_ORE]: 'Diamond Ore',
  [BlockType.SNOW]: 'Snow',
  [BlockType.ICE]: 'Ice',
  [BlockType.BUSH]: 'Bush',
  [BlockType.RED_FLOWER]: 'Red Flower',
  [BlockType.YELLOW_FLOWER]: 'Yellow Flower',
  [BlockType.CACTUS]: 'Cactus',
  [BlockType.PALM_WOOD]: 'Palm Wood',
  [BlockType.PALM_LEAVES]: 'Palm Leaves',
  [BlockType.DEAD_BUSH]: 'Dead Bush',
}

export const BlockHardness: Record<BlockType, number> = {
  [BlockType.AIR]: 0,
  [BlockType.GRASS]: 0.6,
  [BlockType.DIRT]: 0.5,
  [BlockType.STONE]: 1.5,
  [BlockType.SAND]: 0.5,
  [BlockType.WATER]: -1,
  [BlockType.WOOD]: 2.0,
  [BlockType.LEAVES]: 0.2,
  [BlockType.COBBLESTONE]: 2.0,
  [BlockType.PLANKS]: 1.5,
  [BlockType.CRAFTING_TABLE]: 1.5,
  [BlockType.BEDROCK]: -1,
  [BlockType.GLASS]: 0.3,
  [BlockType.BRICK]: 2.0,
  [BlockType.COAL_ORE]: 3.0,
  [BlockType.IRON_ORE]: 3.0,
  [BlockType.GOLD_ORE]: 3.0,
  [BlockType.DIAMOND_ORE]: 3.0,
  [BlockType.SNOW]: 0.2,
  [BlockType.ICE]: 0.5,
  [BlockType.BUSH]: 0.1,
  [BlockType.RED_FLOWER]: 0.1,
  [BlockType.YELLOW_FLOWER]: 0.1,
  [BlockType.CACTUS]: 0.4,
  [BlockType.PALM_WOOD]: 2.0,
  [BlockType.PALM_LEAVES]: 0.2,
  [BlockType.DEAD_BUSH]: 0.1,
}

export const BlockColors: Record<
  BlockType,
  { all?: number; top?: number; bottom?: number; side?: number }
> = {
  [BlockType.AIR]: { all: 0x000000 },
  [BlockType.GRASS]: {
    top: 0x5d9b37,
    bottom: 0x8b6914,
    side: 0x8b6914,
  },
  [BlockType.DIRT]: { all: 0x8b6914 },
  [BlockType.STONE]: { all: 0x7f7f7f },
  [BlockType.SAND]: { all: 0xe3d59e },
  [BlockType.WATER]: { all: 0x3366aa },
  [BlockType.WOOD]: {
    top: 0x6b5030,
    bottom: 0x6b5030,
    side: 0x8b6842,
  },
  [BlockType.LEAVES]: { all: 0x2d8a2d },
  [BlockType.COBBLESTONE]: { all: 0x6a6a6a },
  [BlockType.PLANKS]: { all: 0xbc9862 },
  [BlockType.CRAFTING_TABLE]: {
    top: 0x825d32,
    bottom: 0xbc9862,
    side: 0xbc9862,
  },
  [BlockType.BEDROCK]: { all: 0x2a2a2a },
  [BlockType.GLASS]: { all: 0xc8dcff },
  [BlockType.BRICK]: { all: 0x8b4533 },
  [BlockType.COAL_ORE]: { all: 0x6a6a6a },
  [BlockType.IRON_ORE]: { all: 0x8a7a6a },
  [BlockType.GOLD_ORE]: { all: 0x8a7a5a },
  [BlockType.DIAMOND_ORE]: { all: 0x6a8a8a },
  [BlockType.SNOW]: { all: 0xf0f0f0 },
  [BlockType.ICE]: { all: 0xa0c0e0 },
  [BlockType.BUSH]: { all: 0x3cb03c },
  [BlockType.RED_FLOWER]: { all: 0xff0000 },
  [BlockType.YELLOW_FLOWER]: { all: 0xffff00 },
  [BlockType.CACTUS]: { all: 0x558822 },
  [BlockType.PALM_WOOD]: { all: 0x8b6914 },
  [BlockType.PALM_LEAVES]: { all: 0x55aa33 },
  [BlockType.DEAD_BUSH]: { all: 0x8b5a2b },
}
