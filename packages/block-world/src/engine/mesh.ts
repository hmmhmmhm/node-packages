import * as THREE from 'three'
import { BlockType, ChunkMeshData } from '../types'
import { CHUNK_SIZE, CHUNK_HEIGHT, BlockColors } from '../constants'
import { getBlock, getBlockIndex } from './world'

export function getBlockColor(type: BlockType, face?: string): number {
  const blockColors = BlockColors[type] || { all: 0xff00ff }

  if (blockColors.all) return blockColors.all

  if (face === 'top') return blockColors.top || blockColors.all || 0xff00ff
  if (face === 'bottom') return blockColors.bottom || blockColors.all || 0xff00ff
  return blockColors.side || blockColors.all || 0xff00ff
}

export function buildChunkMesh(
  cx: number,
  cz: number,
  chunkData: Uint8Array,
  chunks: Map<string, Uint8Array>,
  scene: THREE.Scene
): ChunkMeshData {
  const solidVertices: number[] = []
  const solidNormals: number[] = []
  const solidUvs: number[] = []
  const solidIndices: number[] = []
  const solidColors: number[] = []

  const transparentVertices: number[] = []
  const transparentNormals: number[] = []
  const transparentUvs: number[] = []
  const transparentIndices: number[] = []
  const transparentColors: number[] = []

  const faceData: Record<
    string,
    { dir: [number, number, number]; corners: [number, number, number][] }
  > = {
    top: {
      dir: [0, 1, 0],
      corners: [
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
        [0, 1, 0],
      ],
    },
    bottom: {
      dir: [0, -1, 0],
      corners: [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
      ],
    },
    front: {
      dir: [0, 0, 1],
      corners: [
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 1],
      ],
    },
    back: {
      dir: [0, 0, -1],
      corners: [
        [1, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    },
    right: {
      dir: [1, 0, 0],
      corners: [
        [1, 0, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
      ],
    },
    left: {
      dir: [-1, 0, 0],
      corners: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    },
  }

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const block = chunkData[getBlockIndex(x, y, z)]

        if (block === BlockType.AIR) continue

        const worldX = cx * CHUNK_SIZE + x
        const worldZ = cz * CHUNK_SIZE + z

        const isTransparent =
          block === BlockType.WATER ||
          block === BlockType.GLASS ||
          block === BlockType.LEAVES

        const vertices = isTransparent ? transparentVertices : solidVertices
        const normals = isTransparent ? transparentNormals : solidNormals
        const uvs = isTransparent ? transparentUvs : solidUvs
        const indices = isTransparent ? transparentIndices : solidIndices
        const colors = isTransparent ? transparentColors : solidColors

        for (const [faceName, face] of Object.entries(faceData)) {
          const neighborX = worldX + face.dir[0]
          const neighborY = y + face.dir[1]
          const neighborZ = worldZ + face.dir[2]

          const neighbor = getBlock(neighborX, neighborY, neighborZ, chunks)

          const neighborIsTransparent =
            neighbor === BlockType.AIR ||
            neighbor === BlockType.WATER ||
            neighbor === BlockType.GLASS ||
            neighbor === BlockType.LEAVES

          const shouldRenderFace = isTransparent
            ? neighbor !== block && neighborIsTransparent
            : neighborIsTransparent

          if (shouldRenderFace) {
            const baseIndex = vertices.length / 3

            const faceType =
              faceName === 'top' ? 'top' : faceName === 'bottom' ? 'bottom' : 'side'
            const colorHex = getBlockColor(block, faceType)

            const r = ((colorHex >> 16) & 255) / 255
            const g = ((colorHex >> 8) & 255) / 255
            const b = (colorHex & 255) / 255

            let shade = 1.0
            if (faceName === 'top') shade = 1.0
            else if (faceName === 'bottom') shade = 0.5
            else if (faceName === 'front' || faceName === 'back') shade = 0.8
            else shade = 0.7

            for (const corner of face.corners) {
              vertices.push(worldX + corner[0], y + corner[1], worldZ + corner[2])
              normals.push(face.dir[0], face.dir[1], face.dir[2])
              colors.push(r * shade, g * shade, b * shade)
            }

            uvs.push(0, 0, 1, 0, 1, 1, 0, 1)

            indices.push(
              baseIndex,
              baseIndex + 1,
              baseIndex + 2,
              baseIndex,
              baseIndex + 2,
              baseIndex + 3
            )
          }
        }
      }
    }
  }

  const meshData: ChunkMeshData = {}

  if (solidVertices.length > 0) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(solidVertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(solidNormals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(solidUvs, 2))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(solidColors, 3))
    geometry.setIndex(solidIndices)

    const material = new THREE.MeshLambertMaterial({
      vertexColors: true,
      side: THREE.FrontSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = true
    scene.add(mesh)
    meshData.solid = mesh
  }

  if (transparentVertices.length > 0) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(transparentVertices, 3)
    )
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(transparentNormals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(transparentUvs, 2))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(transparentColors, 3))
    geometry.setIndex(transparentIndices)

    const material = new THREE.MeshLambertMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = true
    mesh.renderOrder = 1
    scene.add(mesh)
    meshData.transparent = mesh
  }

  return meshData
}

export function disposeMesh(meshData: ChunkMeshData, scene: THREE.Scene) {
  if (meshData.solid) {
    scene.remove(meshData.solid)
    meshData.solid.geometry.dispose()
    if (Array.isArray(meshData.solid.material)) {
      meshData.solid.material.forEach((m) => m.dispose())
    } else {
      meshData.solid.material.dispose()
    }
  }
  if (meshData.transparent) {
    scene.remove(meshData.transparent)
    meshData.transparent.geometry.dispose()
    if (Array.isArray(meshData.transparent.material)) {
      meshData.transparent.material.forEach((m) => m.dispose())
    } else {
      meshData.transparent.material.dispose()
    }
  }
}
