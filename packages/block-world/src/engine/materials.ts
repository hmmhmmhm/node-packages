import * as THREE from 'three'
import { textureAtlas } from '../utils/textures'

// Shared uniforms for foliage
const foliageUniforms = {
  uTime: { value: 0 },
}

export function updateFoliageTime(deltaTime: number) {
  foliageUniforms.uTime.value += deltaTime
}

let foliageMaterial: THREE.MeshStandardMaterial | null = null

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
    shader.uniforms.uTime = foliageUniforms.uTime

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
      
      // Simple wind effect
      float windStrength = 0.15;
      float windSpeed = 2.0;
      float windScale = 0.5;
      
      // Calculate sway based on position and time
      float swayX = sin(uTime * windSpeed + position.z * windScale) * windStrength;
      float swayZ = cos(uTime * windSpeed * 0.8 + position.x * windScale) * windStrength;
      float swayY = sin(uTime * windSpeed * 1.2 + position.x * windScale + position.z * windScale) * windStrength * 0.5;

      transformed.x += swayX;
      transformed.z += swayZ;
      transformed.y += swayY;
      `
    )
  }

  // Make sure the custom material properties are preserved if cloned (though we plan to use the singleton)
  foliageMaterial.customProgramCacheKey = () => {
    return 'foliage-wind'
  }

  return foliageMaterial
}
