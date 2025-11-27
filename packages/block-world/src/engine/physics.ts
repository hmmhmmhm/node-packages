import * as THREE from 'three'
import { Player, RaycastHit } from '../types'
import { BlockType } from '../types'
import { getBlock } from './world'
import { PLAYER_HEIGHT, PLAYER_WIDTH, GRAVITY, JUMP_FORCE, MOVE_SPEED, FLY_SPEED } from '../constants'

export function updatePlayerPhysics(
  player: Player,
  deltaTime: number,
  keys: Record<string, boolean>,
  chunks: Map<string, Uint8Array>
) {
  const moveSpeed = player.isFlying ? FLY_SPEED : MOVE_SPEED

  const forward = new THREE.Vector3(
    -Math.sin(player.rotation.y),
    0,
    -Math.cos(player.rotation.y)
  )
  const right = new THREE.Vector3(Math.cos(player.rotation.y), 0, -Math.sin(player.rotation.y))

  const moveDirection = new THREE.Vector3(0, 0, 0)

  if (keys['KeyW']) moveDirection.add(forward)
  if (keys['KeyS']) moveDirection.sub(forward)
  if (keys['KeyA']) moveDirection.sub(right)
  if (keys['KeyD']) moveDirection.add(right)

  if (moveDirection.length() > 0) {
    moveDirection.normalize()
  }

  if (player.isFlying) {
    player.velocity.x = moveDirection.x * moveSpeed
    player.velocity.z = moveDirection.z * moveSpeed

    if (keys['Space']) {
      player.velocity.y = moveSpeed
    } else if (keys['ShiftLeft'] || keys['ShiftRight']) {
      player.velocity.y = -moveSpeed
    } else {
      player.velocity.y = 0
    }
  } else {
    player.velocity.x = moveDirection.x * moveSpeed
    player.velocity.z = moveDirection.z * moveSpeed

    player.velocity.y += GRAVITY * deltaTime

    if (keys['Space'] && player.isGrounded) {
      player.velocity.y = JUMP_FORCE
      player.isGrounded = false
    }
  }

  const newPos = player.position.clone()
  newPos.x += player.velocity.x * deltaTime
  newPos.y += player.velocity.y * deltaTime
  newPos.z += player.velocity.z * deltaTime

  const collision = checkCollision(newPos, chunks)

  if (!collision.x) {
    player.position.x = newPos.x
  } else {
    player.velocity.x = 0
  }

  if (!collision.y) {
    player.position.y = newPos.y
    player.isGrounded = false
  } else {
    if (player.velocity.y < 0) {
      player.isGrounded = true
    }
    player.velocity.y = 0
  }

  if (!collision.z) {
    player.position.z = newPos.z
  } else {
    player.velocity.z = 0
  }

  if (player.position.y < -10) {
    player.position.y = 50
    player.velocity.set(0, 0, 0)
  }
}

function checkCollision(
  position: THREE.Vector3,
  chunks: Map<string, Uint8Array>
): { x: boolean; y: boolean; z: boolean } {
  const collision = { x: false, y: false, z: false }
  const padding = PLAYER_WIDTH / 2

  const checkPoints: [number, number, number][] = [
    [0, 0, 0],
    [0, PLAYER_HEIGHT * 0.5, 0],
    [0, PLAYER_HEIGHT, 0],
  ]

  for (const [dx, dy, dz] of checkPoints) {
    const checkX = position.x + dx
    const checkY = position.y + dy
    const checkZ = position.z + dz

    if (isBlockSolid(Math.floor(checkX + padding), Math.floor(checkY), Math.floor(position.z), chunks))
      collision.x = true
    if (isBlockSolid(Math.floor(checkX - padding), Math.floor(checkY), Math.floor(position.z), chunks))
      collision.x = true

    if (isBlockSolid(Math.floor(position.x), Math.floor(checkY), Math.floor(checkZ + padding), chunks))
      collision.z = true
    if (isBlockSolid(Math.floor(position.x), Math.floor(checkY), Math.floor(checkZ - padding), chunks))
      collision.z = true
  }

  const groundY = position.y - 0.1
  const headY = position.y + PLAYER_HEIGHT

  for (let ox = -1; ox <= 1; ox++) {
    for (let oz = -1; oz <= 1; oz++) {
      const checkX = Math.floor(position.x + ox * padding * 0.5)
      const checkZ = Math.floor(position.z + oz * padding * 0.5)

      if (isBlockSolid(checkX, Math.floor(groundY), checkZ, chunks)) {
        collision.y = true
      }
      if (isBlockSolid(checkX, Math.floor(headY), checkZ, chunks)) {
        collision.y = true
      }
    }
  }

  return collision
}

function isBlockSolid(x: number, y: number, z: number, chunks: Map<string, Uint8Array>): boolean {
  const block = getBlock(x, y, z, chunks)
  return block !== BlockType.AIR && block !== BlockType.WATER
}

export function raycast(
  camera: THREE.PerspectiveCamera,
  playerRotation: { x: number; y: number },
  chunks: Map<string, Uint8Array>,
  maxDistance: number = 5
): RaycastHit | null {
  const direction = new THREE.Vector3(0, 0, -1)
  direction.applyEuler(new THREE.Euler(playerRotation.x, playerRotation.y, 0, 'YXZ'))

  const origin = camera.position.clone()
  const step = 0.1

  let lastAirPos: { x: number; y: number; z: number } | null = null

  for (let d = 0; d < maxDistance; d += step) {
    const pos = origin.clone().add(direction.clone().multiplyScalar(d))
    const blockX = Math.floor(pos.x)
    const blockY = Math.floor(pos.y)
    const blockZ = Math.floor(pos.z)

    const block = getBlock(blockX, blockY, blockZ, chunks)

    if (block !== BlockType.AIR && block !== BlockType.WATER) {
      return {
        block: { x: blockX, y: blockY, z: blockZ, type: block },
        previous: lastAirPos,
        distance: d,
      }
    }

    lastAirPos = { x: blockX, y: blockY, z: blockZ }
  }

  return null
}
