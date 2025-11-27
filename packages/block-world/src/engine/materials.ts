import * as THREE from 'three'
import { textureAtlas } from '../utils/textures'

// Shared uniforms for global time-based effects
const sharedUniforms = {
  uTime: { value: 0 },
}

export function updateGlobalShaderTime(deltaTime: number) {
  sharedUniforms.uTime.value += deltaTime
}

// Backwards compatibility / Alias
export const updateFoliageTime = updateGlobalShaderTime

let foliageMaterial: THREE.MeshStandardMaterial | null = null
let fluidMaterial: THREE.MeshStandardMaterial | null = null

export function getFoliageMaterial(): THREE.MeshStandardMaterial {
  if (foliageMaterial) return foliageMaterial

  foliageMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    map: textureAtlas,
    transparent: true,
    alphaTest: 0.5, // Higher alpha test for crisper leaves
    side: THREE.DoubleSide,
    roughness: 0.8,
    metalness: 0.1,
  })

  foliageMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = sharedUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      attribute float windWeight;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      // Simple wind effect for leaves
      float windStrength = 0.15;
      float windSpeed = 2.0;
      float windScale = 0.5;
      
      // Calculate sway
      float swayX = sin(uTime * windSpeed + position.z * windScale) * windStrength;
      float swayZ = cos(uTime * windSpeed * 0.8 + position.x * windScale) * windStrength;
      float swayY = sin(uTime * windSpeed * 1.2 + position.x * windScale + position.z * windScale) * windStrength * 0.5;

      // Apply wind weight (0 for bottom of bush, 1 for top of bush/leaves)
      swayX *= windWeight;
      swayZ *= windWeight;
      swayY *= windWeight;

      transformed.x += swayX;
      transformed.z += swayZ;
      transformed.y += swayY;
      `
    )
  }

  foliageMaterial.customProgramCacheKey = () => {
    return 'foliage-wind'
  }

  return foliageMaterial
}

export function getFluidMaterial(): THREE.MeshStandardMaterial {
  if (fluidMaterial) return fluidMaterial

  fluidMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    map: textureAtlas,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false, // Water usually shouldn't write depth to allow transparency sorting/seeing through
    roughness: 0.1,
    metalness: 0.1,
  })

  fluidMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = sharedUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      // Water wave effect
      // Slightly slower and more "rolling" than leaves
      float waveStrength = 0.2; // Increased from 0.1
      float waveSpeed = 1.5;
      float waveScale = 0.3;
      
      float waveY = sin(uTime * waveSpeed + position.x * waveScale + position.z * waveScale) * waveStrength;
      // Add some secondary ripple
      waveY += cos(uTime * waveSpeed * 1.5 + position.x * 0.5) * waveStrength * 0.5;

      transformed.y += waveY;
      
      // Very subtle X/Z movement to simulate flowing/shifting
      transformed.x += sin(uTime * 0.5 + position.y) * 0.1; // Increased from 0.05
      transformed.z += cos(uTime * 0.5 + position.y) * 0.1; // Increased from 0.05
      `
    )
  }

  fluidMaterial.customProgramCacheKey = () => {
    return 'fluid-wave'
  }

  return fluidMaterial
}
