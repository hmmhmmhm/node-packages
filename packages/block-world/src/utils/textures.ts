import * as THREE from 'three'
import { BlockType } from '../types'

const textureCanvas = document.createElement('canvas')
const textureCtx = textureCanvas.getContext('2d')!
textureCanvas.width = 16
textureCanvas.height = 16

export const blockTextures: Record<number, Record<string, THREE.Texture>> = {}
export const blockTextureImages: Record<number, string> = {}

function drawGrassTop() {
  textureCtx.fillStyle = '#5d9b37'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const shade = Math.random() * 0.3 - 0.15
    textureCtx.fillStyle = shade > 0 ? '#6ba83f' : '#4f8a2c'
    textureCtx.fillRect(x, y, 1, 1)
  }

  for (let i = 0; i < 8; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = '#7fc247'
    textureCtx.fillRect(x, y, 1, 1)
  }
}

function drawGrassSide() {
  textureCtx.fillStyle = '#8b6914'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = Math.random() > 0.5 ? '#7a5c12' : '#9c7618'
    textureCtx.fillRect(x, y, 1, 1)
  }

  textureCtx.fillStyle = '#5d9b37'
  textureCtx.fillRect(0, 0, 16, 1)

  for (let x = 0; x < 16; x++) {
    const depth = Math.floor(Math.random() * 3) + 1
    for (let y = 1; y < depth; y++) {
      if (Math.random() > 0.3) {
        textureCtx.fillStyle = Math.random() > 0.5 ? '#5d9b37' : '#4f8a2c'
        textureCtx.fillRect(x, y, 1, 1)
      }
    }
  }
}

function drawDirt() {
  textureCtx.fillStyle = '#8b6914'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 50; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const colors = ['#7a5c12', '#9c7618', '#6d5010', '#a37d1a']
    textureCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    textureCtx.fillRect(x, y, 1, 1)
  }

  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * 14)
    const y = Math.floor(Math.random() * 14)
    textureCtx.fillStyle = '#5a4810'
    textureCtx.fillRect(x, y, 2, 2)
  }
}

function drawStone() {
  textureCtx.fillStyle = '#7f7f7f'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 60; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const shade = Math.floor(Math.random() * 40) - 20
    const gray = Math.max(60, Math.min(160, 127 + shade))
    textureCtx.fillStyle = `rgb(${gray},${gray},${gray})`
    textureCtx.fillRect(x, y, 1, 1)
  }

  textureCtx.strokeStyle = '#666666'
  textureCtx.lineWidth = 1
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * 16)
    const y1 = Math.floor(Math.random() * 16)
    const x2 = x1 + Math.floor(Math.random() * 6) - 3
    const y2 = y1 + Math.floor(Math.random() * 6) - 3
    textureCtx.beginPath()
    textureCtx.moveTo(x1, y1)
    textureCtx.lineTo(x2, y2)
    textureCtx.stroke()
  }
}

function drawSand() {
  textureCtx.fillStyle = '#e3d59e'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 80; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const colors = ['#d4c68f', '#f2e6af', '#c9b880', '#e8daa0']
    textureCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    textureCtx.fillRect(x, y, 1, 1)
  }
}

function drawWater() {
  textureCtx.fillStyle = 'rgba(30, 100, 200, 0.7)'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = 'rgba(60, 140, 230, 0.5)'
    textureCtx.fillRect(x, y, 2, 1)
  }

  textureCtx.fillStyle = 'rgba(100, 180, 255, 0.3)'
  for (let x = 0; x < 16; x += 4) {
    textureCtx.fillRect(x, 0, 2, 16)
  }
}

function drawWoodSide() {
  textureCtx.fillStyle = '#6b5030'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const baseColor = x % 4 < 2 ? '#5a4428' : '#7c5c38'
      textureCtx.fillStyle = baseColor
      textureCtx.fillRect(x, y, 1, 1)
    }
  }

  textureCtx.fillStyle = '#4a3820'
  for (let x = 0; x < 16; x += 4) {
    textureCtx.fillRect(x, 0, 1, 16)
  }
}

function drawWoodTop() {
  textureCtx.fillStyle = '#6b5030'
  textureCtx.fillRect(0, 0, 16, 16)

  textureCtx.strokeStyle = '#5a4428'
  textureCtx.lineWidth = 1
  for (let r = 2; r < 8; r += 2) {
    textureCtx.beginPath()
    textureCtx.arc(8, 8, r, 0, Math.PI * 2)
    textureCtx.stroke()
  }

  textureCtx.fillStyle = '#4a3820'
  textureCtx.fillRect(7, 7, 2, 2)
}

function drawLeaves() {
  textureCtx.fillStyle = 'rgba(50, 130, 50, 0.9)'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 50; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const colors = ['#2a8a2a', '#3ca03c', '#228822', '#40b040']
    textureCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    textureCtx.fillRect(x, y, 1, 1)
  }

  for (let i = 0; i < 15; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = 'rgba(0, 50, 0, 0.3)'
    textureCtx.fillRect(x, y, 2, 2)
  }
}

function drawCobblestone() {
  textureCtx.fillStyle = '#6a6a6a'
  textureCtx.fillRect(0, 0, 16, 16)

  const stones = [
    { x: 0, y: 0, w: 6, h: 5 },
    { x: 6, y: 0, w: 5, h: 6 },
    { x: 11, y: 0, w: 5, h: 5 },
    { x: 0, y: 5, w: 5, h: 6 },
    { x: 5, y: 5, w: 6, h: 5 },
    { x: 11, y: 5, w: 5, h: 6 },
    { x: 0, y: 11, w: 6, h: 5 },
    { x: 6, y: 10, w: 5, h: 6 },
    { x: 11, y: 11, w: 5, h: 5 },
  ]

  stones.forEach((stone) => {
    const shade = Math.floor(Math.random() * 40) + 80
    textureCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
    textureCtx.fillRect(stone.x, stone.y, stone.w - 1, stone.h - 1)
  })

  textureCtx.fillStyle = '#4a4a4a'
  stones.forEach((stone) => {
    textureCtx.fillRect(stone.x + stone.w - 1, stone.y, 1, stone.h)
    textureCtx.fillRect(stone.x, stone.y + stone.h - 1, stone.w, 1)
  })
}

function drawPlanks() {
  textureCtx.fillStyle = '#b08840'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let y = 0; y < 16; y += 4) {
    const offset = (y / 4) % 2 === 0 ? 0 : 8
    for (let x = 0; x < 16; x++) {
      const plankX = (x + offset) % 16
      const shade = Math.sin(plankX * 0.5) * 15
      textureCtx.fillStyle = `rgb(${176 + shade}, ${136 + shade}, ${64 + shade})`
      textureCtx.fillRect(x, y, 1, 3)
    }
    textureCtx.fillStyle = '#8a6830'
    textureCtx.fillRect(0, y + 3, 16, 1)
  }

  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = Math.random() > 0.5 ? '#c09850' : '#9a7838'
    textureCtx.fillRect(x, y, 1, 1)
  }
}

function drawCraftingTableTop() {
  drawPlanks()

  textureCtx.fillStyle = '#5a4830'
  textureCtx.fillRect(1, 1, 14, 14)

  textureCtx.fillStyle = '#8a7050'
  textureCtx.fillRect(2, 2, 12, 12)

  textureCtx.fillStyle = '#6a5840'
  for (let x = 2; x < 14; x += 4) {
    for (let y = 2; y < 14; y += 4) {
      textureCtx.fillRect(x, y, 3, 3)
    }
  }

  textureCtx.fillStyle = '#4a3828'
  textureCtx.fillRect(5, 2, 1, 12)
  textureCtx.fillRect(10, 2, 1, 12)
  textureCtx.fillRect(2, 5, 12, 1)
  textureCtx.fillRect(2, 10, 12, 1)
}

function drawCraftingTableSide() {
  drawPlanks()

  textureCtx.fillStyle = '#5a4830'
  textureCtx.fillRect(0, 0, 16, 3)

  textureCtx.fillStyle = '#7a6848'
  for (let x = 1; x < 15; x += 2) {
    textureCtx.fillRect(x, 1, 1, 1)
  }

  textureCtx.fillStyle = '#6a5838'
  textureCtx.fillRect(3, 5, 4, 7)
  textureCtx.fillRect(9, 5, 4, 7)

  textureCtx.fillStyle = '#5a4828'
  textureCtx.fillRect(5, 6, 1, 5)
  textureCtx.fillRect(11, 6, 1, 5)
}

function drawBedrock() {
  textureCtx.fillStyle = '#1a1a1a'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const shade = Math.floor(Math.random() * 30) + 20
    textureCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
    textureCtx.fillRect(x, y, 1, 1)
  }

  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 14)
    const y = Math.floor(Math.random() * 14)
    textureCtx.fillStyle = '#3a3a3a'
    textureCtx.fillRect(x, y, 2, 2)
  }
}

function drawGlass() {
  textureCtx.fillStyle = 'rgba(200, 220, 255, 0.3)'
  textureCtx.fillRect(0, 0, 16, 16)

  textureCtx.strokeStyle = 'rgba(150, 180, 210, 0.8)'
  textureCtx.lineWidth = 1
  textureCtx.strokeRect(0.5, 0.5, 15, 15)

  textureCtx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  textureCtx.fillRect(1, 1, 4, 4)

  textureCtx.fillStyle = 'rgba(100, 150, 200, 0.1)'
  textureCtx.fillRect(4, 4, 8, 8)
}

function drawBrick() {
  textureCtx.fillStyle = '#8B4513'
  textureCtx.fillRect(0, 0, 16, 16)

  const brickPattern = [
    { x: 0, y: 0, w: 7, h: 3 },
    { x: 8, y: 0, w: 8, h: 3 },
    { x: -4, y: 4, w: 8, h: 3 },
    { x: 4, y: 4, w: 8, h: 3 },
    { x: 12, y: 4, w: 4, h: 3 },
    { x: 0, y: 8, w: 7, h: 3 },
    { x: 8, y: 8, w: 8, h: 3 },
    { x: -4, y: 12, w: 8, h: 3 },
    { x: 4, y: 12, w: 8, h: 3 },
    { x: 12, y: 12, w: 4, h: 4 },
  ]

  brickPattern.forEach((brick) => {
    const shade = Math.floor(Math.random() * 30) - 15
    textureCtx.fillStyle = `rgb(${159 + shade}, ${82 + shade}, ${45 + shade})`
    textureCtx.fillRect(brick.x, brick.y, brick.w - 1, brick.h - 1)
  })

  textureCtx.fillStyle = '#a0a0a0'
  for (let y = 3; y < 16; y += 4) {
    textureCtx.fillRect(0, y, 16, 1)
  }
  textureCtx.fillRect(7, 0, 1, 4)
  textureCtx.fillRect(3, 4, 1, 4)
  textureCtx.fillRect(11, 4, 1, 4)
  textureCtx.fillRect(7, 8, 1, 4)
  textureCtx.fillRect(3, 12, 1, 4)
  textureCtx.fillRect(11, 12, 1, 4)
}

function drawOreBase() {
  textureCtx.fillStyle = '#7f7f7f'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    const shade = Math.floor(Math.random() * 30) + 100
    textureCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
    textureCtx.fillRect(x, y, 1, 1)
  }
}

function drawCoalOre() {
  drawOreBase()
  const oreSpots: [number, number][] = [
    [2, 3],
    [5, 7],
    [9, 2],
    [12, 9],
    [6, 12],
    [3, 10],
    [10, 5],
    [13, 13],
  ]
  oreSpots.forEach(([x, y]) => {
    textureCtx.fillStyle = '#2a2a2a'
    textureCtx.fillRect(x, y, 2, 2)
    textureCtx.fillStyle = '#1a1a1a'
    textureCtx.fillRect(x, y, 1, 1)
  })
}

function drawIronOre() {
  drawOreBase()
  const oreSpots: [number, number][] = [
    [2, 3],
    [6, 8],
    [10, 2],
    [13, 10],
    [4, 12],
    [8, 5],
  ]
  oreSpots.forEach(([x, y]) => {
    textureCtx.fillStyle = '#d4a574'
    textureCtx.fillRect(x, y, 2, 2)
    textureCtx.fillStyle = '#e8c4a4'
    textureCtx.fillRect(x, y, 1, 1)
  })
}

function drawGoldOre() {
  drawOreBase()
  const oreSpots: [number, number][] = [
    [3, 4],
    [7, 9],
    [11, 3],
    [5, 13],
    [12, 11],
  ]
  oreSpots.forEach(([x, y]) => {
    textureCtx.fillStyle = '#ffd700'
    textureCtx.fillRect(x, y, 2, 2)
    textureCtx.fillStyle = '#ffec80'
    textureCtx.fillRect(x, y, 1, 1)
  })
}

function drawDiamondOre() {
  drawOreBase()
  const oreSpots: [number, number][] = [
    [3, 5],
    [8, 10],
    [12, 4],
    [6, 13],
    [2, 9],
  ]
  oreSpots.forEach(([x, y]) => {
    textureCtx.fillStyle = '#4aedd9'
    textureCtx.fillRect(x, y, 2, 2)
    textureCtx.fillStyle = '#7df9ec'
    textureCtx.fillRect(x, y, 1, 1)
  })
}

function drawSnow() {
  textureCtx.fillStyle = '#fafafa'
  textureCtx.fillRect(0, 0, 16, 16)

  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#e8e8e8'
    textureCtx.fillRect(x, y, 1, 1)
  }

  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    textureCtx.fillStyle = 'rgba(200, 220, 255, 0.3)'
    textureCtx.fillRect(x, y, 1, 1)
  }
}

function drawIce() {
  textureCtx.fillStyle = 'rgba(150, 200, 255, 0.8)'
  textureCtx.fillRect(0, 0, 16, 16)

  textureCtx.strokeStyle = 'rgba(100, 160, 220, 0.5)'
  textureCtx.lineWidth = 1
  for (let i = 0; i < 5; i++) {
    const x1 = Math.floor(Math.random() * 16)
    const y1 = Math.floor(Math.random() * 16)
    const x2 = x1 + Math.floor(Math.random() * 8) - 4
    const y2 = y1 + Math.floor(Math.random() * 8) - 4
    textureCtx.beginPath()
    textureCtx.moveTo(x1, y1)
    textureCtx.lineTo(x2, y2)
    textureCtx.stroke()
  }

  textureCtx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  textureCtx.fillRect(1, 1, 3, 3)
  textureCtx.fillRect(10, 8, 2, 2)
}

function generateTexture(type: BlockType, face: string): string {
  textureCtx.clearRect(0, 0, 16, 16)

  switch (type) {
    case BlockType.GRASS:
      if (face === 'top') drawGrassTop()
      else if (face === 'bottom') drawDirt()
      else drawGrassSide()
      break
    case BlockType.DIRT:
      drawDirt()
      break
    case BlockType.STONE:
      drawStone()
      break
    case BlockType.SAND:
      drawSand()
      break
    case BlockType.WATER:
      drawWater()
      break
    case BlockType.WOOD:
      if (face === 'top' || face === 'bottom') drawWoodTop()
      else drawWoodSide()
      break
    case BlockType.LEAVES:
      drawLeaves()
      break
    case BlockType.COBBLESTONE:
      drawCobblestone()
      break
    case BlockType.PLANKS:
      drawPlanks()
      break
    case BlockType.CRAFTING_TABLE:
      if (face === 'top') drawCraftingTableTop()
      else if (face === 'bottom') drawPlanks()
      else drawCraftingTableSide()
      break
    case BlockType.BEDROCK:
      drawBedrock()
      break
    case BlockType.GLASS:
      drawGlass()
      break
    case BlockType.BRICK:
      drawBrick()
      break
    case BlockType.COAL_ORE:
      drawCoalOre()
      break
    case BlockType.IRON_ORE:
      drawIronOre()
      break
    case BlockType.GOLD_ORE:
      drawGoldOre()
      break
    case BlockType.DIAMOND_ORE:
      drawDiamondOre()
      break
    case BlockType.SNOW:
      drawSnow()
      break
    case BlockType.ICE:
      drawIce()
      break
    default:
      textureCtx.fillStyle = '#ff00ff'
      textureCtx.fillRect(0, 0, 16, 16)
  }

  return textureCanvas.toDataURL()
}

export function initializeTextures() {
  const faces = ['top', 'bottom', 'front', 'back', 'left', 'right']

  for (let type = 1; type <= 19; type++) {
    blockTextures[type] = {}
    blockTextureImages[type] = generateTexture(type as BlockType, 'front')

    faces.forEach((face) => {
      const dataUrl = generateTexture(type as BlockType, face)
      const texture = new THREE.TextureLoader().load(dataUrl)
      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.NearestFilter
      blockTextures[type][face] = texture
    })
  }
}
