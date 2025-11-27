import * as THREE from 'three'
import { BlockType } from '../types'

const TEXTURE_SIZE = 16
const ATLAS_SIZE = 256

const atlasCanvas = document.createElement('canvas')
const atlasCtx = atlasCanvas.getContext('2d')!
atlasCanvas.width = ATLAS_SIZE
atlasCanvas.height = ATLAS_SIZE
atlasCtx.imageSmoothingEnabled = false

const textureCanvas = document.createElement('canvas')
const textureCtx = textureCanvas.getContext('2d')!
textureCanvas.width = TEXTURE_SIZE
textureCanvas.height = TEXTURE_SIZE
textureCtx.imageSmoothingEnabled = false

export const blockTextureImages: Record<number, string> = {}
export let textureAtlas: THREE.Texture | null = null

// Map from "BlockType:Face" to UV coordinates [u, v, u+w, v+h]
// Normalized to 0..1
export const blockUVs: Record<string, number[]> = {}

function drawGrassTop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#5d9b37'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 40; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const shade = Math.random() * 0.3 - 0.15
    ctx.fillStyle = shade > 0 ? '#6ba83f' : '#4f8a2c'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  for (let i = 0; i < 8; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = '#7fc247'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }
}

function drawGrassSide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#8b6914'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 30; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = Math.random() > 0.5 ? '#7a5c12' : '#9c7618'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  ctx.fillStyle = '#5d9b37'
  ctx.fillRect(x, y, 16, 1)

  for (let bx = 0; bx < 16; bx++) {
    const depth = Math.floor(Math.random() * 3) + 1
    for (let by = 1; by < depth; by++) {
      if (Math.random() > 0.3) {
        ctx.fillStyle = Math.random() > 0.5 ? '#5d9b37' : '#4f8a2c'
        ctx.fillRect(x + bx, y + by, 1, 1)
      }
    }
  }
}

function drawDirt(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#8b6914'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 50; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const colors = ['#7a5c12', '#9c7618', '#6d5010', '#a37d1a']
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  for (let i = 0; i < 5; i++) {
    const bx = Math.floor(Math.random() * 14)
    const by = Math.floor(Math.random() * 14)
    ctx.fillStyle = '#5a4810'
    ctx.fillRect(x + bx, y + by, 2, 2)
  }
}

function drawStone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#7f7f7f'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 60; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const shade = Math.floor(Math.random() * 40) - 20
    const gray = Math.max(60, Math.min(160, 127 + shade))
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  ctx.strokeStyle = '#666666'
  ctx.lineWidth = 1
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * 16)
    const y1 = Math.floor(Math.random() * 16)
    const x2 = x1 + Math.floor(Math.random() * 6) - 3
    const y2 = y1 + Math.floor(Math.random() * 6) - 3
    ctx.beginPath()
    ctx.moveTo(x + x1, y + y1)
    ctx.lineTo(x + x2, y + y2)
    ctx.stroke()
  }
}

function drawSand(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#e3d59e'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 80; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const colors = ['#d4c68f', '#f2e6af', '#c9b880', '#e8daa0']
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.fillRect(x + bx, y + by, 1, 1)
  }
}

function drawWater(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(30, 100, 200, 0.7)'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 20; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = 'rgba(60, 140, 230, 0.5)'
    ctx.fillRect(x + bx, y + by, 2, 1)
  }

  ctx.fillStyle = 'rgba(100, 180, 255, 0.3)'
  for (let bx = 0; bx < 16; bx += 4) {
    ctx.fillRect(x + bx, y, 2, 16)
  }
}

function drawWoodSide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#6b5030'
  ctx.fillRect(x, y, 16, 16)

  for (let by = 0; by < 16; by++) {
    for (let bx = 0; bx < 16; bx++) {
      const baseColor = bx % 4 < 2 ? '#5a4428' : '#7c5c38'
      ctx.fillStyle = baseColor
      ctx.fillRect(x + bx, y + by, 1, 1)
    }
  }

  ctx.fillStyle = '#4a3820'
  for (let bx = 0; bx < 16; bx += 4) {
    ctx.fillRect(x + bx, y, 1, 16)
  }
}

function drawWoodTop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#6b5030'
  ctx.fillRect(x, y, 16, 16)

  ctx.strokeStyle = '#5a4428'
  ctx.lineWidth = 1
  for (let r = 2; r < 8; r += 2) {
    ctx.beginPath()
    ctx.arc(x + 8, y + 8, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.fillStyle = '#4a3820'
  ctx.fillRect(x + 7, y + 7, 2, 2)
}

function drawLeaves(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(50, 130, 50, 0.9)'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 50; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const colors = ['#2a8a2a', '#3ca03c', '#228822', '#40b040']
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  for (let i = 0; i < 15; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = 'rgba(0, 50, 0, 0.3)'
    ctx.fillRect(x + bx, y + by, 2, 2)
  }
}

function drawCobblestone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#6a6a6a'
  ctx.fillRect(x, y, 16, 16)

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
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
    ctx.fillRect(x + stone.x, y + stone.y, stone.w - 1, stone.h - 1)
  })

  ctx.fillStyle = '#4a4a4a'
  stones.forEach((stone) => {
    ctx.fillRect(x + stone.x + stone.w - 1, y + stone.y, 1, stone.h)
    ctx.fillRect(x + stone.x, y + stone.y + stone.h - 1, stone.w, 1)
  })
}

function drawPlanks(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#b08840'
  ctx.fillRect(x, y, 16, 16)

  for (let by = 0; by < 16; by += 4) {
    const offset = (by / 4) % 2 === 0 ? 0 : 8
    for (let bx = 0; bx < 16; bx++) {
      const plankX = (bx + offset) % 16
      const shade = Math.sin(plankX * 0.5) * 15
      ctx.fillStyle = `rgb(${176 + shade}, ${136 + shade}, ${64 + shade})`
      ctx.fillRect(x + bx, y + by, 1, 3)
    }
    ctx.fillStyle = '#8a6830'
    ctx.fillRect(x, y + by + 3, 16, 1)
  }

  for (let i = 0; i < 20; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = Math.random() > 0.5 ? '#c09850' : '#9a7838'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }
}

function drawCraftingTableTop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawPlanks(ctx, x, y)

  ctx.fillStyle = '#5a4830'
  ctx.fillRect(x + 1, y + 1, 14, 14)

  ctx.fillStyle = '#8a7050'
  ctx.fillRect(x + 2, y + 2, 12, 12)

  ctx.fillStyle = '#6a5840'
  for (let bx = 2; bx < 14; bx += 4) {
    for (let by = 2; by < 14; by += 4) {
      ctx.fillRect(x + bx, y + by, 3, 3)
    }
  }

  ctx.fillStyle = '#4a3828'
  ctx.fillRect(x + 5, y + 2, 1, 12)
  ctx.fillRect(x + 10, y + 2, 1, 12)
  ctx.fillRect(x + 2, y + 5, 12, 1)
  ctx.fillRect(x + 2, y + 10, 12, 1)
}

function drawCraftingTableSide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawPlanks(ctx, x, y)

  ctx.fillStyle = '#5a4830'
  ctx.fillRect(x, y, 16, 3)

  ctx.fillStyle = '#7a6848'
  for (let bx = 1; bx < 15; bx += 2) {
    ctx.fillRect(x + bx, y + 1, 1, 1)
  }

  ctx.fillStyle = '#6a5838'
  ctx.fillRect(x + 3, y + 5, 4, 7)
  ctx.fillRect(x + 9, y + 5, 4, 7)

  ctx.fillStyle = '#5a4828'
  ctx.fillRect(x + 5, y + 6, 1, 5)
  ctx.fillRect(x + 11, y + 6, 1, 5)
}

function drawBedrock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 100; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const shade = Math.floor(Math.random() * 30) + 20
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  for (let i = 0; i < 10; i++) {
    const bx = Math.floor(Math.random() * 14)
    const by = Math.floor(Math.random() * 14)
    ctx.fillStyle = '#3a3a3a'
    ctx.fillRect(x + bx, y + by, 2, 2)
  }
}

function drawGlass(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(200, 220, 255, 0.3)'
  ctx.fillRect(x, y, 16, 16)

  ctx.strokeStyle = 'rgba(150, 180, 210, 0.8)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, 15, 15)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.fillRect(x + 1, y + 1, 4, 4)

  ctx.fillStyle = 'rgba(100, 150, 200, 0.1)'
  ctx.fillRect(x + 4, y + 4, 8, 8)
}

function drawBrick(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x, y, 16, 16)

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
    ctx.fillStyle = `rgb(${159 + shade}, ${82 + shade}, ${45 + shade})`
    ctx.fillRect(x + brick.x, y + brick.y, brick.w - 1, brick.h - 1)
  })

  ctx.fillStyle = '#a0a0a0'
  for (let by = 3; by < 16; by += 4) {
    ctx.fillRect(x, y + by, 16, 1)
  }
  ctx.fillRect(x + 7, y, 1, 4)
  ctx.fillRect(x + 3, y + 4, 1, 4)
  ctx.fillRect(x + 11, y + 4, 1, 4)
  ctx.fillRect(x + 7, y + 8, 1, 4)
  ctx.fillRect(x + 3, y + 12, 1, 4)
  ctx.fillRect(x + 11, y + 12, 1, 4)
}

function drawOreBase(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#7f7f7f'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 40; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const shade = Math.floor(Math.random() * 30) + 100
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
    ctx.fillRect(x + bx, y + by, 1, 1)
  }
}

function drawCoalOre(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawOreBase(ctx, x, y)
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
  oreSpots.forEach(([ox, oy]) => {
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(x + ox, y + oy, 2, 2)
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x + ox, y + oy, 1, 1)
  })
}

function drawIronOre(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawOreBase(ctx, x, y)
  const oreSpots: [number, number][] = [
    [2, 3],
    [6, 8],
    [10, 2],
    [13, 10],
    [4, 12],
    [8, 5],
  ]
  oreSpots.forEach(([ox, oy]) => {
    ctx.fillStyle = '#d4a574'
    ctx.fillRect(x + ox, y + oy, 2, 2)
    ctx.fillStyle = '#e8c4a4'
    ctx.fillRect(x + ox, y + oy, 1, 1)
  })
}

function drawGoldOre(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawOreBase(ctx, x, y)
  const oreSpots: [number, number][] = [
    [3, 4],
    [7, 9],
    [11, 3],
    [5, 13],
    [12, 11],
  ]
  oreSpots.forEach(([ox, oy]) => {
    ctx.fillStyle = '#ffd700'
    ctx.fillRect(x + ox, y + oy, 2, 2)
    ctx.fillStyle = '#ffec80'
    ctx.fillRect(x + ox, y + oy, 1, 1)
  })
}

function drawDiamondOre(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawOreBase(ctx, x, y)
  const oreSpots: [number, number][] = [
    [3, 5],
    [8, 10],
    [12, 4],
    [6, 13],
    [2, 9],
  ]
  oreSpots.forEach(([ox, oy]) => {
    ctx.fillStyle = '#4aedd9'
    ctx.fillRect(x + ox, y + oy, 2, 2)
    ctx.fillStyle = '#7df9ec'
    ctx.fillRect(x + ox, y + oy, 1, 1)
  })
}

function drawSnow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(x, y, 16, 16)

  for (let i = 0; i < 30; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#e8e8e8'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  for (let i = 0; i < 10; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = 'rgba(200, 220, 255, 0.3)'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }
}

function drawIce(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(150, 200, 255, 0.8)'
  ctx.fillRect(x, y, 16, 16)

  ctx.strokeStyle = 'rgba(100, 160, 220, 0.5)'
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i++) {
    const x1 = Math.floor(Math.random() * 16)
    const y1 = Math.floor(Math.random() * 16)
    const x2 = x1 + Math.floor(Math.random() * 8) - 4
    const y2 = y1 + Math.floor(Math.random() * 8) - 4
    ctx.beginPath()
    ctx.moveTo(x + x1, y + y1)
    ctx.lineTo(x + x2, y + y2)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.fillRect(x + 1, y + 1, 3, 3)
  ctx.fillRect(x + 10, y + 8, 2, 2)
}

function drawBush(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Clear background for transparency (since we'll use cross-mesh)
  ctx.clearRect(x, y, 16, 16)

  // Draw some vertical stems/leaves for "tall grass/bush" look
  for (let i = 0; i < 8; i++) {
    const stemX = Math.floor(Math.random() * 14) + 1
    const stemHeight = Math.floor(Math.random() * 10) + 6
    const width = Math.random() > 0.5 ? 1 : 2

    // Vary greens
    const colors = ['#3cb03c', '#4cd04c', '#329932', '#55dd55', '#2a8a2a']
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]

    // Draw from bottom up
    ctx.fillRect(x + stemX, y + 16 - stemHeight, width, stemHeight)
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  // Clear background for transparency
  ctx.clearRect(x, y, 16, 16)

  // Stem
  ctx.fillStyle = '#329932'
  const stemX = 7 + Math.floor(Math.random() * 2)
  ctx.fillRect(x + stemX, y + 6, 2, 10)

  // Leaves
  ctx.fillStyle = '#3cb03c'
  ctx.fillRect(x + stemX - 2, y + 12, 2, 1)
  ctx.fillRect(x + stemX + 2, y + 11, 2, 1)

  // Flower Head
  ctx.fillStyle = color
  // Center
  ctx.fillRect(x + stemX - 1, y + 2, 4, 4)
  // Petals
  ctx.fillRect(x + stemX - 2, y + 3, 1, 2)
  ctx.fillRect(x + stemX + 3, y + 3, 1, 2)
  ctx.fillRect(x + stemX, y + 1, 2, 1)
  ctx.fillRect(x + stemX, y + 6, 2, 1)

  // Center dot
  ctx.fillStyle = '#ffff00' // Yellow center for contrast (or orange for yellow flower)
  if (color === '#ffff00') ctx.fillStyle = '#cc6600'
  ctx.fillRect(x + stemX, y + 3, 2, 2)
}

function drawCactusSide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#558822'
  ctx.fillRect(x, y, 16, 16)

  // Ribs
  ctx.fillStyle = '#447711'
  for (let bx = 2; bx < 16; bx += 4) {
    ctx.fillRect(x + bx, y, 2, 16)
  }

  // Spines
  ctx.fillStyle = '#ddddaa'
  for (let by = 2; by < 16; by += 4) {
    for (let bx = 1; bx < 16; bx += 4) {
      if (Math.random() > 0.5) {
        ctx.fillRect(x + bx, y + by, 1, 1)
      }
    }
  }
}

function drawCactusTop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#558822'
  ctx.fillRect(x, y, 16, 16)

  // Ribs from top view
  ctx.fillStyle = '#447711'
  for (let bx = 2; bx < 16; bx += 4) {
    ctx.fillRect(x + bx, y, 2, 16)
  }
  for (let by = 2; by < 16; by += 4) {
    ctx.fillRect(x, y + by, 16, 2)
  }
}

function drawPalmWoodSide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#a68b5b' // Lighter brown/tan
  ctx.fillRect(x, y, 16, 16)

  // Horizontal texture (palm rings)
  ctx.fillStyle = '#8c734b'
  for (let by = 0; by < 16; by += 4) {
    ctx.fillRect(x, y + by, 16, 2)
  }

  // Some noise
  for (let i = 0; i < 20; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    ctx.fillStyle = Math.random() > 0.5 ? '#7a623d' : '#c4a875'
    ctx.fillRect(x + bx, y + by, 1, 1)
  }
}

function drawPalmWoodTop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#d9c59e' // Very light core
  ctx.fillRect(x, y, 16, 16)

  // Bark ring
  ctx.lineWidth = 2
  ctx.strokeStyle = '#8c734b'
  ctx.strokeRect(x + 1, y + 1, 14, 14)

  // Core pattern
  ctx.fillStyle = '#c4a875'
  ctx.fillRect(x + 6, y + 6, 4, 4)
}

function drawPalmLeaves(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#55aa33' // Tropical green
  ctx.fillRect(x, y, 16, 16)

  // Frond texture
  for (let i = 0; i < 40; i++) {
    const bx = Math.floor(Math.random() * 16)
    const by = Math.floor(Math.random() * 16)
    const colors = ['#449922', '#66bb44', '#338811']
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.fillRect(x + bx, y + by, 1, 1)
  }

  // Veins or structure
  ctx.fillStyle = '#338811'
  // Diagonal
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) ctx.fillRect(x + i, y + i, 2, 2)
    if (i % 4 === 2) ctx.fillRect(x + 15 - i, y + i, 2, 2)
  }
}

function drawDeadBush(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.clearRect(x, y, 16, 16)

  ctx.fillStyle = '#8b5a2b' // Dried brown

  // Draw leafless stems
  // Main stem
  ctx.fillRect(x + 7, y + 10, 2, 6)

  // Branches
  ctx.fillRect(x + 5, y + 6, 1, 5)
  ctx.fillRect(x + 10, y + 7, 1, 4)
  ctx.fillRect(x + 3, y + 4, 1, 3)
  ctx.fillRect(x + 12, y + 5, 1, 3)

  // Connecting horizontal bits
  ctx.fillRect(x + 6, y + 10, 1, 1)
  ctx.fillRect(x + 9, y + 10, 1, 1)
}

function drawToContext(ctx: CanvasRenderingContext2D, x: number, y: number, type: BlockType, face: string) {
  switch (type) {
    case BlockType.GRASS:
      if (face === 'top') drawGrassTop(ctx, x, y)
      else if (face === 'bottom') drawDirt(ctx, x, y)
      else drawGrassSide(ctx, x, y)
      break
    case BlockType.DIRT:
      drawDirt(ctx, x, y)
      break
    case BlockType.STONE:
      drawStone(ctx, x, y)
      break
    case BlockType.SAND:
      drawSand(ctx, x, y)
      break
    case BlockType.WATER:
      drawWater(ctx, x, y)
      break
    case BlockType.WOOD:
      if (face === 'top' || face === 'bottom') drawWoodTop(ctx, x, y)
      else drawWoodSide(ctx, x, y)
      break
    case BlockType.LEAVES:
      drawLeaves(ctx, x, y)
      break
    case BlockType.BUSH:
      drawBush(ctx, x, y)
      break
    case BlockType.DEAD_BUSH:
      drawDeadBush(ctx, x, y)
      break
    case BlockType.RED_FLOWER:
      drawFlower(ctx, x, y, '#ff2222')
      break
    case BlockType.YELLOW_FLOWER:
      drawFlower(ctx, x, y, '#ffff00')
      break
    case BlockType.CACTUS:
      if (face === 'top' || face === 'bottom') drawCactusTop(ctx, x, y)
      else drawCactusSide(ctx, x, y)
      break
    case BlockType.PALM_WOOD:
      if (face === 'top' || face === 'bottom') drawPalmWoodTop(ctx, x, y)
      else drawPalmWoodSide(ctx, x, y)
      break
    case BlockType.PALM_LEAVES:
      drawPalmLeaves(ctx, x, y)
      break
    case BlockType.COBBLESTONE:
      drawCobblestone(ctx, x, y)
      break
    case BlockType.PLANKS:
      drawPlanks(ctx, x, y)
      break
    case BlockType.CRAFTING_TABLE:
      if (face === 'top') drawCraftingTableTop(ctx, x, y)
      else if (face === 'bottom') drawPlanks(ctx, x, y)
      else drawCraftingTableSide(ctx, x, y)
      break
    case BlockType.BEDROCK:
      drawBedrock(ctx, x, y)
      break
    case BlockType.GLASS:
      drawGlass(ctx, x, y)
      break
    case BlockType.BRICK:
      drawBrick(ctx, x, y)
      break
    case BlockType.COAL_ORE:
      drawCoalOre(ctx, x, y)
      break
    case BlockType.IRON_ORE:
      drawIronOre(ctx, x, y)
      break
    case BlockType.GOLD_ORE:
      drawGoldOre(ctx, x, y)
      break
    case BlockType.DIAMOND_ORE:
      drawDiamondOre(ctx, x, y)
      break
    case BlockType.SNOW:
      drawSnow(ctx, x, y)
      break
    case BlockType.ICE:
      drawIce(ctx, x, y)
      break
    default:
      ctx.fillStyle = '#ff00ff'
      ctx.fillRect(x, y, 16, 16)
  }
}

export function initializeTextures() {
  const faces = ['top', 'bottom', 'side']
  let currentX = 0
  let currentY = 0

  // Initialize atlas
  atlasCtx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE)

  for (let type = 1; type <= 26; type++) {
    // For HUD
    textureCtx.clearRect(0, 0, 16, 16)
    drawToContext(textureCtx, 0, 0, type as BlockType, 'front')
    blockTextureImages[type] = textureCanvas.toDataURL()

    // For Atlas
    faces.forEach(face => {
      // Calculate UV
      const u = currentX / ATLAS_SIZE
      const v = 1 - (currentY + TEXTURE_SIZE) / ATLAS_SIZE
      const w = TEXTURE_SIZE / ATLAS_SIZE
      const h = TEXTURE_SIZE / ATLAS_SIZE

      drawToContext(atlasCtx, currentX, currentY, type as BlockType, face)

      // Store UVs
      if (face === 'side') {
        blockUVs[`${type}:front`] = [u, v, u + w, v + h]
        blockUVs[`${type}:back`] = [u, v, u + w, v + h]
        blockUVs[`${type}:left`] = [u, v, u + w, v + h]
        blockUVs[`${type}:right`] = [u, v, u + w, v + h]
        blockUVs[`${type}:side`] = [u, v, u + w, v + h]
      } else {
        blockUVs[`${type}:${face}`] = [u, v, u + w, v + h]
      }

      // Advance position
      currentX += TEXTURE_SIZE
      if (currentX >= ATLAS_SIZE) {
        currentX = 0
        currentY += TEXTURE_SIZE
      }
    })
  }

  textureAtlas = new THREE.CanvasTexture(atlasCanvas)
  textureAtlas.magFilter = THREE.NearestFilter
  textureAtlas.minFilter = THREE.NearestFilter
  textureAtlas.colorSpace = THREE.SRGBColorSpace
}

export function createLensflareTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')!

  // Main glow
  const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 220, 0.6)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.1)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export function createSunTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')!

  const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.1, 'rgba(255, 255, 240, 0.9)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 220, 0.2)')
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export function getTextureUV(type: BlockType, face: string) {
  const key = `${type}:${face}`
  return blockUVs[key] || blockUVs[`${BlockType.DIRT}:side`] // Default fallback
}
