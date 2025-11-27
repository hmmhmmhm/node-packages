import * as THREE from 'three'

export enum BlockType {
  AIR = 0,
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
  SAND = 4,
  WATER = 5,
  WOOD = 6,
  LEAVES = 7,
  COBBLESTONE = 8,
  PLANKS = 9,
  CRAFTING_TABLE = 10,
  BEDROCK = 11,
  GLASS = 12,
  BRICK = 13,
  COAL_ORE = 14,
  IRON_ORE = 15,
  GOLD_ORE = 16,
  DIAMOND_ORE = 17,
  SNOW = 18,
  ICE = 19,
}

export interface Player {
  position: THREE.Vector3
  velocity: THREE.Vector3
  rotation: { x: number; y: number }
  isFlying: boolean
  isGrounded: boolean
  selectedSlot: number
}

export interface InventoryItem {
  type: BlockType
  count: number
}

export interface Inventory {
  slots: (InventoryItem | null)[]
  hotbar: (InventoryItem | null)[]
}

export interface CraftingRecipe {
  pattern: (BlockType | null)[][]
  result: { type: BlockType; count: number }
}

export interface RaycastHit {
  block: { x: number; y: number; z: number; type: BlockType }
  previous: { x: number; y: number; z: number } | null
  distance: number
}

export interface ChunkMeshData {
  solid?: THREE.Mesh
  transparent?: THREE.Mesh
}

export interface GameState {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  player: Player
  chunks: Map<string, Uint8Array>
  chunkMeshes: Map<string, ChunkMeshData>
  inventory: Inventory
  craftingSlots: (InventoryItem | null)[]
  craftingResult: InventoryItem | null
  cursorItem: InventoryItem | null
  isInventoryOpen: boolean
  isPointerLocked: boolean
  keys: Record<string, boolean>
  targetBlock: string | null
  breakProgress: number
  isBreaking: boolean
  droppedItems: any[]
  gameStarted: boolean
}
