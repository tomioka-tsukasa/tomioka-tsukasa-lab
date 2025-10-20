import * as THREE from 'three'
import { LoadedAssets } from '../../setupMember'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const imageChangerNoise = (
  loadedAssets: LoadedAssets
) => {
  const geo = new THREE.PlaneGeometry(20, 20, 1, 1)

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0 },
      u_texture_01: { value: loadedAssets.textures['sample-01'] },
      u_texture_02: { value: loadedAssets.textures['sample-02'] },
    },
    wireframe: false,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(0, 10, 0)

  console.log(mesh)

  return mesh
}
