import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Player, Inventory, ChunkMeshData } from '../types'
import { BlockType } from '../types'
import { CHUNK_SIZE, CHUNK_HEIGHT, PLAYER_HEIGHT, MOUSE_SENSITIVITY, RENDER_DISTANCE, BlockHardness } from '../constants'
import { WorldGenerator, getChunkKey, worldToChunk, setBlock, getChunksInRadius } from '../engine/world'
import { buildChunkMesh, disposeMesh } from '../engine/mesh'
import { updatePlayerPhysics, raycast } from '../engine/physics'
import { initializeTextures } from '../utils/textures'
import { Crosshair } from './crosshair'
import { Hud } from './hud'
import { StatusBar, DebugInfo } from './status-bar'

export function BlockWorld() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fps, setFps] = useState(60)
  const [chunkCount, setChunkCount] = useState(0)

  const gameStateRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    player: Player
    chunks: Map<string, Uint8Array>
    chunkMeshes: Map<string, ChunkMeshData>
    inventory: Inventory
    worldGen: WorldGenerator
    clock: THREE.Clock
    keys: Record<string, boolean>
    isPointerLocked: boolean
    lastSpacePress: number
    highlightMesh: THREE.LineSegments | null
    breakProgress: number
    isBreaking: boolean
    targetBlock: string | null
    mouseHeld: boolean
    frameCount: number
    lastFpsUpdate: number
    gameStarted: boolean
  } | null>(null)

  useEffect(() => {
    console.log('[BlockWorld] useEffect 시작')
    if (!containerRef.current) return

    // Initialize Three.js
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)
    scene.fog = new THREE.Fog(0x87ceeb, 30, RENDER_DISTANCE * CHUNK_SIZE - 20)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1) // Performance optimization for post-processing
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffee, 2.0)
    directionalLight.position.set(100, 200, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 4096
    directionalLight.shadow.mapSize.height = 4096
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.camera.left = -200
    directionalLight.shadow.camera.right = 200
    directionalLight.shadow.camera.top = 200
    directionalLight.shadow.camera.bottom = -200
    directionalLight.shadow.bias = -0.0005
    scene.add(directionalLight)

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x8b6914, 1.0)
    scene.add(hemiLight)

    // Sun Mesh with Glow
    const sunGroup = new THREE.Group()
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa })
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
    sunGroup.add(sunMesh)

    // Glow effect (simple transparent sphere)
    const glowGeometry = new THREE.SphereGeometry(35, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    sunGroup.add(glowMesh)

    sunGroup.position.copy(directionalLight.position).normalize().multiplyScalar(400)
    scene.add(sunGroup)

    // Clouds
    const cloudCount = 150
    const cloudGeometry = new THREE.BoxGeometry(15, 6, 15)
    const cloudMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    })
    const clouds = new THREE.InstancedMesh(cloudGeometry, cloudMaterial, cloudCount * 10)

    const dummy = new THREE.Object3D()
    let instanceIdx = 0
    for (let i = 0; i < cloudCount; i++) {
      const cx = (Math.random() - 0.5) * 800
      const cy = 90 + Math.random() * 30 // Lower clouds
      const cz = (Math.random() - 0.5) * 800

      const blocksInCloud = Math.floor(Math.random() * 5) + 4
      for (let j = 0; j < blocksInCloud; j++) {
        dummy.position.set(
          cx + (Math.random() - 0.5) * 40,
          cy + (Math.random() - 0.5) * 10,
          cz + (Math.random() - 0.5) * 40
        )
        // Random scale for fluffiness
        const scale = 0.8 + Math.random() * 0.6
        dummy.scale.set(scale, scale * 0.6, scale)
        dummy.updateMatrix()
        clouds.setMatrixAt(instanceIdx++, dummy.matrix)
      }
    }
    clouds.count = instanceIdx
    scene.add(clouds)

    // Sky
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32)
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0x87ceeb) },
        offset: { value: 20 },
        exponent: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(sky)

    // Post-processing Setup
    const composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // SAO (Screen Space Ambient Occlusion) - Adds depth to corners
    const saoPass = new SAOPass(scene, camera)
    saoPass.params.saoBias = 0.5
    saoPass.params.saoIntensity = 0.05
    saoPass.params.saoScale = 200
    saoPass.params.saoKernelRadius = 20
    saoPass.params.saoMinResolution = 0
    saoPass.params.saoBlur = true
    saoPass.params.saoBlurRadius = 8
    composer.addPass(saoPass)

    // Bloom - Glowing effects
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.3,  // strength
      0.5,  // radius
      0.85  // threshold
    )
    composer.addPass(bloomPass)

    // Output Pass (Tone Mapping & Color Correction)
    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    // Initialize textures
    initializeTextures()

    // Initialize player
    const player: Player = {
      position: new THREE.Vector3(0, 30, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      rotation: { x: 0, y: 0 },
      isFlying: false,
      isGrounded: false,
      selectedSlot: 0,
    }

    camera.position.copy(player.position)
    camera.position.y += PLAYER_HEIGHT * 0.9

    // Initialize inventory
    const inventory: Inventory = {
      slots: new Array(36).fill(null),
      hotbar: [
        { type: BlockType.GRASS, count: 64 },
        { type: BlockType.DIRT, count: 64 },
        { type: BlockType.STONE, count: 64 },
        { type: BlockType.SAND, count: 64 },
        { type: BlockType.WOOD, count: 64 },
        { type: BlockType.LEAVES, count: 64 },
        { type: BlockType.COBBLESTONE, count: 64 },
        { type: BlockType.PLANKS, count: 64 },
        { type: BlockType.GLASS, count: 64 },
      ],
    }

    const worldGen = new WorldGenerator(12345)
    const chunks = new Map<string, Uint8Array>()
    const chunkMeshes = new Map<string, ChunkMeshData>()

    // Generate initial chunks
    const { cx, cz } = worldToChunk(player.position.x, player.position.z)
    const initialChunks = getChunksInRadius(cx, cz, RENDER_DISTANCE)

    initialChunks.forEach(({ cx: chunkX, cz: chunkZ }) => {
      const chunkData = worldGen.generateChunk(chunkX, chunkZ)
      const key = getChunkKey(chunkX, chunkZ)
      chunks.set(key, chunkData)
      const meshData = buildChunkMesh(chunkX, chunkZ, chunkData, chunks, scene)
      chunkMeshes.set(key, meshData)
    })

    // Find spawn point
    for (let y = CHUNK_HEIGHT - 1; y >= 0; y--) {
      const block = chunks.get(getChunkKey(0, 0))?.[y * CHUNK_SIZE * CHUNK_SIZE]
      if (block && block !== BlockType.AIR && block !== BlockType.WATER) {
        player.position.y = y + 2
        break
      }
    }

    // Block highlight
    const highlightGeometry = new THREE.BoxGeometry(1.002, 1.002, 1.002)
    const highlightEdges = new THREE.EdgesGeometry(highlightGeometry)
    const highlightMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    const highlightMesh = new THREE.LineSegments(highlightEdges, highlightMaterial)
    scene.add(highlightMesh)
    highlightMesh.visible = false

    const gameState = {
      scene,
      camera,
      renderer,
      player,
      chunks,
      chunkMeshes,
      inventory,
      worldGen,
      clock: new THREE.Clock(),
      keys: {} as Record<string, boolean>,
      isPointerLocked: false,
      lastSpacePress: 0,
      highlightMesh,
      breakProgress: 0,
      isBreaking: false,
      targetBlock: null as string | null,
      mouseHeld: false,
      frameCount: 0,
      lastFpsUpdate: 0,
      gameStarted: true,
    }

    gameStateRef.current = gameState
    console.log('[BlockWorld] gameState 초기화 완료', { gameStarted: gameState.gameStarted })

    // 게임 자동 시작
    gameState.clock.start()
    setTimeout(() => {
      if (gameStateRef.current) {
        gameStateRef.current.renderer.domElement.requestPointerLock()
          .then(() => console.log('[PointerLock] 자동 요청 성공'))
          .catch(err => console.error('[PointerLock] 자동 요청 실패:', err))
      }
    }, 100)

    // Event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[Input] 키 다운:', e.code, '| gameStarted:', gameState.gameStarted)
      gameState.keys[e.code] = true

      if (e.code === 'Space') {
        const now = Date.now()
        if (now - gameState.lastSpacePress < 300) {
          gameState.player.isFlying = !gameState.player.isFlying
        }
        gameState.lastSpacePress = now
      }

      if (e.code === 'KeyF') {
        gameState.player.isFlying = !gameState.player.isFlying
      }

      if (e.code.startsWith('Digit')) {
        const slot = parseInt(e.code.replace('Digit', '')) - 1
        if (slot >= 0 && slot <= 8) {
          gameState.player.selectedSlot = slot
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys[e.code] = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!gameState.isPointerLocked) {
        console.log('[Input] 마우스 이동 무시 - Pointer Lock 없음')
        return
      }

      console.log('[Input] 마우스 이동:', e.movementX, e.movementY)
      gameState.player.rotation.y -= e.movementX * MOUSE_SENSITIVITY
      gameState.player.rotation.x -= e.movementY * MOUSE_SENSITIVITY
      gameState.player.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, gameState.player.rotation.x)
      )
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (!gameState.isPointerLocked) {
        renderer.domElement.requestPointerLock()
        return
      }

      if (e.button === 0) {
        gameState.mouseHeld = true
        gameState.isBreaking = true
        gameState.breakProgress = 0
      } else if (e.button === 2) {
        placeBlock()
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        gameState.mouseHeld = false
        gameState.isBreaking = false
        gameState.breakProgress = 0
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        gameState.player.selectedSlot = (gameState.player.selectedSlot + 1) % 9
      } else {
        gameState.player.selectedSlot = (gameState.player.selectedSlot - 1 + 9) % 9
      }
    }

    const handlePointerLockChange = () => {
      gameState.isPointerLocked = document.pointerLockElement === renderer.domElement
      console.log('[PointerLock] 상태 변경:', gameState.isPointerLocked, '| element:', document.pointerLockElement)
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }

    const placeBlock = () => {
      const hit = raycast(camera, player.rotation, chunks)
      if (!hit || !hit.previous) return

      const selectedItem = inventory.hotbar[player.selectedSlot]
      if (!selectedItem || selectedItem.count <= 0) return

      const { x: px, y: py, z: pz } = hit.previous

      const playerBlockX = Math.floor(player.position.x)
      const playerBlockY = Math.floor(player.position.y)
      const playerBlockZ = Math.floor(player.position.z)

      if (
        px === playerBlockX &&
        pz === playerBlockZ &&
        (py === playerBlockY || py === playerBlockY + 1)
      ) {
        return
      }

      setBlock(px, py, pz, selectedItem.type, chunks)
      selectedItem.count--
      if (selectedItem.count <= 0) {
        inventory.hotbar[player.selectedSlot] = null
      }

      // Rebuild mesh
      const { cx, cz } = worldToChunk(px, pz)
      rebuildChunk(cx, cz)
    }

    const rebuildChunk = (cx: number, cz: number) => {
      const key = getChunkKey(cx, cz)
      const chunkData = chunks.get(key)
      if (!chunkData) return

      const meshData = chunkMeshes.get(key)
      if (meshData) {
        disposeMesh(meshData, scene)
        chunkMeshes.delete(key)
      }

      const newMeshData = buildChunkMesh(cx, cz, chunkData, chunks, scene)
      chunkMeshes.set(key, newMeshData)

      // Rebuild neighbors
      const localX = ((Math.floor(player.position.x) % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
      const localZ = ((Math.floor(player.position.z) % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
      if (localX === 0) rebuildChunk(cx - 1, cz)
      if (localX === CHUNK_SIZE - 1) rebuildChunk(cx + 1, cz)
      if (localZ === 0) rebuildChunk(cx, cz - 1)
      if (localZ === CHUNK_SIZE - 1) rebuildChunk(cx, cz + 1)
    }

    console.log('[BlockWorld] 이벤트 리스너 등록 시작')
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('wheel', handleWheel)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('contextmenu', (e) => e.preventDefault())
    window.addEventListener('resize', handleResize)
    console.log('[BlockWorld] 이벤트 리스너 등록 완료')

    // Animation loop
    let frameCount = 0
    const animate = () => {
      requestAnimationFrame(animate)

      if (!gameState.gameStarted) {
        renderer.render(scene, camera)
        return
      }

      // 10프레임마다 한 번씩 로그
      if (frameCount % 60 === 0) {
        console.log('[Animate] 프레임:', frameCount, '| keys:', Object.keys(gameState.keys).filter(k => gameState.keys[k]))
      }
      frameCount++

      const deltaTime = Math.min(gameState.clock.getDelta(), 0.1)

      updatePlayerPhysics(player, deltaTime, gameState.keys, chunks)

      // Update block breaking
      if (gameState.isBreaking && gameState.mouseHeld) {
        const hit = raycast(camera, player.rotation, chunks)
        if (hit) {
          const currentTarget = `${hit.block.x},${hit.block.y},${hit.block.z}`
          if (gameState.targetBlock !== currentTarget) {
            gameState.targetBlock = currentTarget
            gameState.breakProgress = 0
          }

          const hardness = BlockHardness[hit.block.type] || 1
          if (hardness >= 0) {
            gameState.breakProgress += deltaTime / hardness
            if (gameState.breakProgress >= 1) {
              setBlock(hit.block.x, hit.block.y, hit.block.z, BlockType.AIR, chunks)
              const selectedItem = inventory.hotbar[player.selectedSlot]
              if (selectedItem) {
                selectedItem.count++
              } else {
                inventory.hotbar[player.selectedSlot] = { type: hit.block.type, count: 1 }
              }
              gameState.breakProgress = 0
              gameState.targetBlock = null
              const { cx, cz } = worldToChunk(hit.block.x, hit.block.z)
              rebuildChunk(cx, cz)
            }
          }
        } else {
          gameState.targetBlock = null
          gameState.breakProgress = 0
        }
      }

      // Update highlight
      const hit = raycast(camera, player.rotation, chunks)
      if (hit && highlightMesh) {
        highlightMesh.visible = true
        highlightMesh.position.set(hit.block.x + 0.5, hit.block.y + 0.5, hit.block.z + 0.5)

        if (gameState.isBreaking && gameState.breakProgress > 0) {
          const scale = 1 + gameState.breakProgress * 0.05
          highlightMesh.scale.setScalar(scale)
          highlightMesh.material.color.setHex(
            gameState.breakProgress > 0.7 ? 0xff0000 : gameState.breakProgress > 0.4 ? 0xffff00 : 0x000000
          )
        } else {
          highlightMesh.scale.setScalar(1)
          highlightMesh.material.color.setHex(0x000000)
        }
      } else if (highlightMesh) {
        highlightMesh.visible = false
      }

      // Update camera
      camera.position.copy(player.position)
      camera.position.y += PLAYER_HEIGHT * 0.9
      camera.rotation.order = 'YXZ'
      camera.rotation.y = player.rotation.y
      camera.rotation.x = player.rotation.x

      // FPS counter
      gameState.frameCount++
      const now = performance.now()
      if (now - gameState.lastFpsUpdate >= 1000) {
        setFps(Math.round((gameState.frameCount * 1000) / (now - gameState.lastFpsUpdate)))
        gameState.frameCount = 0
        gameState.lastFpsUpdate = now
      }

      setChunkCount(chunkMeshes.size)

      composer.render()
    }

    console.log('[BlockWorld] 애니메이션 루프 시작')
    animate()

    return () => {
      console.log('[BlockWorld] cleanup 시작 - 이벤트 리스너 제거')
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      window.removeEventListener('resize', handleResize)

      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  const player = gameStateRef.current?.player
  const inventory = gameStateRef.current?.inventory

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div ref={containerRef} className="w-full h-full" />

      <Crosshair />
      {inventory && <Hud hotbar={inventory.hotbar} selectedSlot={player?.selectedSlot || 0} />}
      {player && (
        <StatusBar
          player={player}
          selectedItem={inventory?.hotbar[player.selectedSlot] || null}
          fps={fps}
          chunkCount={chunkCount}
        />
      )}
      <DebugInfo chunkCount={chunkCount} faceCount={0} />
    </div>
  )
}
