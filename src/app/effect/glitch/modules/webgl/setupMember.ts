import { cameraWork } from './cameraWork'
import { LoadingObject, LoadingObjects } from '@/modules/webgl/loading/loadingManagerTypes'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DataTexture, Texture } from 'three'
import { WebGLCtrl } from '@/modules/webgl/webglTypes'
import { GetSpotLight } from '@/modules/webgl/setup/lights/lightsTypes'

/**
 * WebGLセットアップメンバー
 */
export const setupMember = {
  gui: {
    active: true,
    stats: true,
  },
  renderer: {
    active: true,
    shadow: false,
    toneMapping: 0.3,
    pixelRatio: {
      baseSize: {
        width: 1920,
        height: 1080,
      },
      wishPixelRatioPercent: 0.8,
      mobileWishPixelRatioPercent: 0.65,
      minPixelRatio: 0.8,
      groundTextureMinPixelRatio: 0.6,
    },
    groundReflection: true,
    debug: false,
    debugPixelRatioPercent: 0.5,
    targetFps: 30,
    fpsLog: false,
  },
  light: {
    directionalLight: {
      scene: false,
      helper: false,
    },
  },
  camera: cameraWork,
  controls: {
    enabled: true,
    autoRotate: false,
    debug: true,
  },
  scene: {
    environment: '',
    background: false,
    environmentIntensity: 0.07,
  },
  postprocess: {
    active: true,
    bloomPass: {
      active: false,
      strength: 0.3,
      radius: 0.1,
      threshold: 0.85,
    },
    glitchPass: {
      active: false,
      strength: 0.1,
      speed: 1.0,
      rgbOffset: 0.005,
      scanlines: 100,
    },
  },
}

export const lightsMember: Record<string, Required<Parameters<GetSpotLight>[0]>> = {
  spotLightEmblem: {
    parameters: {
      color: '#ffffff',
      intensity: 17,
      distance: 100,
      angle: 0.42,
      decay: 0.98,
      penumbra: 1,
    },
    position: {
      x: 0,
      y: 40,
      z: -40,
    },
    target: {
      x: 0,
      y: 20,
      z: -100,
    },
    shadow: {
    }
  },
  _02: {
    parameters: {
      color: '#ffffff',
      intensity: 100,
      distance: 100,
      angle: Math.PI / 4.2,
      decay: 0.2,
      penumbra: 1,
    },
    position: {
      x: 0,
      y: 14,
      z: 14,
    },
    target: {
      x: 0,
      y: 0,
      z: 0,
    },
    shadow: {
    }
  },
}

/**
 * WebGL管理オブジェクト
 */
export const webglCtrl: WebGLCtrl = {
  loadComplete: false,
  renderer: null,
  camera: null,
  scene: null,
  envmaps: null,
  textures: null,
  controls: null,
  car: null,
  world: null,
}

/**
 * 3Dモデル
 */
export const loadingModels: Array<LoadingObject> = [
]

/**
 * 環境テクスチャ
 */
export const loadingEnvmaps: Array<LoadingObject> = [
  {
    name: 'blocky_photo_studio_1k',
    path: '/assets/envmap/blocky_photo_studio_1k.hdr',
  },
]

/**
 * テクスチャ
 */
export const loadingTextures: Array<LoadingObject> = [
  {
    name: 'Poliigon_PlasterPainted_7664_Metallic',
    path: '/assets/textures/Poliigon_PlasterPainted_7664_Metallic.jpg',
  },
  {
    name: 'Poliigon_PlasterPainted_7664_Roughness',
    path: '/assets/textures/Poliigon_PlasterPainted_7664_Roughness.jpg',
  },
  {
    name: 'Poliigon_PlasterPainted_7664_Normal',
    path: '/assets/textures/Poliigon_PlasterPainted_7664_Normal.png',
  },
  {
    name: 'Poliigon_PlasterPainted_7664_BaseColor',
    path: '/assets/textures/Poliigon_PlasterPainted_7664_BaseColor.jpg',
  },
  {
    name: 'sample-01',
    path: '/assets/images/samples/effect-glitch-sample-01.jpg',
  },
  {
    name: 'sample-02',
    path: '/assets/images/samples/effect-glitch-sample-02.jpg',
  },
]

/**
 * ローディングの型定義
 */
export const loadingAssets = {
  models: loadingModels,
  envmaps: loadingEnvmaps,
  textures: loadingTextures,
}

export type LoadingAssets = {
  models: LoadingObjects,
  envmaps: LoadingObjects,
  textures: LoadingObjects,
}

export type LoadedAssets = {
  models: {
    [key: string]: LoadedModel
  },
  envmaps: {
    [key: string]: LoadedEnvmap
  },
  textures: {
    [key: string]: LoadedTexture
  },
}

export type LoadedModel = GLTF

export type LoadedEnvmap = DataTexture

export type LoadedTexture = Texture
