import * as THREE from 'three'
import { BlockType, ChunkMeshData } from '../types'
import { CHUNK_SIZE, CHUNK_HEIGHT } from '../constants'
import { getBlock, getBlockIndex } from './world'
import { getTextureUV, textureAtlas } from '../utils/textures'
import { getFoliageMaterial, getFluidMaterial } from './materials'

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

  const foliageVertices: number[] = []
  const foliageNormals: number[] = []
  const foliageUvs: number[] = []
  const foliageIndices: number[] = []
  const foliageColors: number[] = []

  const fluidVertices: number[] = []
  const fluidNormals: number[] = []
  const fluidUvs: number[] = []
  const fluidIndices: number[] = []
  const fluidColors: number[] = []

  const faceData: Record<
    string,
    {
      dir: [number, number, number];
      corners: [number, number, number][];
      uvs: [number, number][];
    }
  > = {
    top: {
      dir: [0, 1, 0],
      corners: [
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
        [0, 1, 0],
      ],
      uvs: [[0, 0], [1, 0], [1, 1], [0, 1]]
    },
    bottom: {
      dir: [0, -1, 0],
      corners: [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
      ],
      uvs: [[0, 1], [1, 1], [1, 0], [0, 0]]
    },
    front: {
      dir: [0, 0, 1],
      corners: [
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 1],
      ],
      uvs: [[0, 0], [1, 0], [1, 1], [0, 1]]
    },
    back: {
      dir: [0, 0, -1],
      corners: [
        [1, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      uvs: [[1, 0], [0, 0], [0, 1], [1, 1]]
    },
    right: {
      dir: [1, 0, 0],
      corners: [
        [1, 0, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
      ],
      uvs: [[1, 0], [0, 0], [0, 1], [1, 1]]
    },
    left: {
      dir: [-1, 0, 0],
      corners: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      uvs: [[0, 0], [1, 0], [1, 1], [0, 1]]
    },
  }

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const block = chunkData[getBlockIndex(x, y, z)]

        if (block === BlockType.AIR) continue

        const worldX = cx * CHUNK_SIZE + x
        const worldZ = cz * CHUNK_SIZE + z

        const isFoliage = block === BlockType.LEAVES
        const isFluid = block === BlockType.WATER
        const isTransparent = block === BlockType.GLASS

        let vertices, normals, uvs, indices, colors

        if (isFoliage) {
          vertices = foliageVertices
          normals = foliageNormals
          uvs = foliageUvs
          indices = foliageIndices
          colors = foliageColors
        } else if (isFluid) {
          vertices = fluidVertices
          normals = fluidNormals
          uvs = fluidUvs
          indices = fluidIndices
          colors = fluidColors
        } else if (isTransparent) {
          vertices = transparentVertices
          normals = transparentNormals
          uvs = transparentUvs
          indices = transparentIndices
          colors = transparentColors
        } else {
          vertices = solidVertices
          normals = solidNormals
          uvs = solidUvs
          indices = solidIndices
          colors = solidColors
        }

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

          // Determine if face should be rendered
          let shouldRenderFace = false

          if (isFoliage) {
            shouldRenderFace = neighbor !== block && neighborIsTransparent
          } else if (isFluid) {
            // Fluid renders if neighbor is not the same fluid and is transparent
            // This handles surface rendering correctly (water next to air)
            // and avoids internal faces between same water blocks
            shouldRenderFace = neighbor !== block && neighborIsTransparent
          } else if (isTransparent) {
            shouldRenderFace = neighbor !== block && neighborIsTransparent
          } else {
            shouldRenderFace = neighborIsTransparent
          }

          if (shouldRenderFace) {
            const baseIndex = vertices.length / 3

            const faceType =
              faceName === 'top' ? 'top' : faceName === 'bottom' ? 'bottom' : 'side'

            const uvData = getTextureUV(block, faceType)
            const [uMin, vMin, uMax, vMax] = uvData

            let shade = 1.0
            if (faceName === 'top') shade = 1.0
            else if (faceName === 'bottom') shade = 0.5
            else if (faceName === 'front' || faceName === 'back') shade = 0.8
            else shade = 0.7

            const r = shade
            const g = shade
            const b = shade

            for (const corner of face.corners) {
              vertices.push(worldX + corner[0], y + corner[1], worldZ + corner[2])
              normals.push(face.dir[0], face.dir[1], face.dir[2])
              colors.push(r, g, b)
            }

            for (const uvPoint of face.uvs) {
              const u = uMin + uvPoint[0] * (uMax - uMin)
              const v = vMin + uvPoint[1] * (vMax - vMin)
              uvs.push(u, v)
            }

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

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: textureAtlas,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.FrontSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
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

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: textureAtlas,
      transparent: true,
      opacity: 0.8,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
      roughness: 0.2,
      metalness: 0.1,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = true
    mesh.renderOrder = 1
    scene.add(mesh)
    meshData.transparent = mesh
  }

  if (foliageVertices.length > 0) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(foliageVertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(foliageNormals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(foliageUvs, 2))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(foliageColors, 3))
    geometry.setIndex(foliageIndices)

    const material = getFoliageMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = true
    mesh.renderOrder = 1
    scene.add(mesh)
    meshData.foliage = mesh
  }

  if (fluidVertices.length > 0) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(fluidVertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(fluidNormals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(fluidUvs, 2))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(fluidColors, 3))
    geometry.setIndex(fluidIndices)

    const material = getFluidMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = false // Water usually doesn't cast shadow like solids (or maybe it does, but let's keep it simple)
    mesh.receiveShadow = true
    mesh.frustumCulled = true
    mesh.renderOrder = 1
    scene.add(mesh)
    meshData.fluid = mesh
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
  if (meshData.foliage) {
    scene.remove(meshData.foliage)
    meshData.foliage.geometry.dispose()
    // Do not dispose material as it is shared
  }
  if (meshData.fluid) {
    scene.remove(meshData.fluid)
    meshData.fluid.geometry.dispose()
    // Do not dispose material as it is shared
  }
}
