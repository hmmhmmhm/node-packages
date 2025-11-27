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

    if (!player.isGrounded) {
      player.velocity.y += GRAVITY * deltaTime
    }

    if (keys['Space'] && player.isGrounded) {
      player.velocity.y = JUMP_FORCE
      player.isGrounded = false
    }
  }

  // Helper for auto-step
  const tryAutoStep = (
    targetX: number,
    targetZ: number
  ): boolean => {
    if (!player.isGrounded || player.isFlying) return false

    const stepHeight = 1.1
    const targetY = player.position.y + stepHeight

    const testPos = new THREE.Vector3(targetX, targetY, targetZ)
    const stepCollision = checkCollision(testPos, chunks)

    if (!stepCollision.x && !stepCollision.y && !stepCollision.z) {
      player.position.y = targetY
      return true
    }
    return false
  }

  // Sequential Axis Resolution
  // We handle X, Z, then Y to prevent wall-sticking where wall penetration causes false floor detection

  // 1. X Movement
  let nextX = player.position.x + player.velocity.x * deltaTime
  const tempPos = player.position.clone()
  tempPos.x = nextX

  let col = checkCollision(tempPos, chunks)
  if (col.x) {
    if (tryAutoStep(nextX, player.position.z)) {
      player.position.x = nextX
      // tryAutoStep updates player.position.y, so we sync tempPos
      tempPos.y = player.position.y
    } else {
      player.velocity.x = 0
      tempPos.x = player.position.x // Revert X
    }
  } else {
    player.position.x = nextX
  }

  // 2. Z Movement
  let nextZ = player.position.z + player.velocity.z * deltaTime
  tempPos.z = nextZ

  col = checkCollision(tempPos, chunks)
  if (col.z) {
    if (tryAutoStep(player.position.x, nextZ)) {
      player.position.z = nextZ
      tempPos.y = player.position.y
    } else {
      player.velocity.z = 0
      tempPos.z = player.position.z // Revert Z
    }
  } else {
    player.position.z = nextZ
  }

  // 3. Y Movement
  let nextY = player.position.y + player.velocity.y * deltaTime
  tempPos.y = nextY

  col = checkCollision(tempPos, chunks)
  if (col.y) {
    if (player.velocity.y < 0) {
      // Landed on ground
      player.isGrounded = true

      // Snap to ground
      const groundH = getGroundHeight(tempPos, chunks)
      if (groundH !== null) {
        player.position.y = groundH
      } else {
        player.position.y = nextY // Fallback
      }
    } else {
      // Hit ceiling
      player.velocity.y = 0
      // Do not update position.y to nextY to avoid sticking in ceiling
    }
    player.velocity.y = 0
  } else {
    // No Y collision
    player.position.y = nextY
    player.isGrounded = false
  }

  if (player.position.y < -10) {
    player.position.y = 50
    player.velocity.set(0, 0, 0)
  }
}

function getGroundHeight(position: THREE.Vector3, chunks: Map<string, Uint8Array>): number | null {
  const padding = PLAYER_WIDTH / 2
  const groundY = position.y - 0.1
  let maxHitY = -Infinity
  let hit = false

  for (let ox = -1; ox <= 1; ox++) {
    for (let oz = -1; oz <= 1; oz++) {
      // Check wider area (0.9 padding) to ensure we catch edges we are standing on
      // preventing jitter at block boundaries where auto-step puts us on the edge
      const checkX = Math.floor(position.x + ox * padding * 0.9)
      const checkZ = Math.floor(position.z + oz * padding * 0.9)

      // Check block at floor(groundY)
      if (isBlockSolid(checkX, Math.floor(groundY), checkZ, chunks)) {
        // The top of this block is floor(groundY) + 1
        const blockTop = Math.floor(groundY) + 1
        if (blockTop > maxHitY) maxHitY = blockTop
        hit = true
      }
    }
  }
  return hit ? maxHitY : null
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
      const checkX = Math.floor(position.x + ox * padding * 0.9)
      const checkZ = Math.floor(position.z + oz * padding * 0.9)

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
