import * as THREE from 'three'
import { LoadingManager } from './loadingManagerTypes'
import { LoadedAssets, LoadedEnvmap, LoadedModel, LoadedTexture } from '../setupMember'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { logManager } from '@/lib/logManager/logManager'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export const loadingManager: LoadingManager = async (
  webglInit,
  assets,
) => {
  // [Loading管理](https://threejs.org/docs/index.html#api/en/loaders/managers/LoadingManager)
  const manager = new THREE.LoadingManager()

  /**
   * ローディング進捗の表示
   */
  manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
  }

  manager.onLoad = function ( ) {}

  manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
  }

  manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url )
  }

  /**
   * 3Dモデルのローディング設定
   */
  // [DRACOローダー](https://threejs.org/docs/#examples/en/loaders/DRACOLoader)
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')

  // [GLTFローダー](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
  const gltfLoader = new GLTFLoader(manager)
  gltfLoader.setDRACOLoader(dracoLoader)

  // loadingModels をローディング
  console.log('%c3Dモデルの読み込みを開始します', logManager().styles.blue)

  const modelLoading = new Promise<LoadedAssets['models']>((resolve) => {
    const modelPromises = assets.models.map((model) => {
      return new Promise<{ name: string; model: LoadedModel }>((resolve) => {
        gltfLoader.load(model.path, (gltf) => {
          resolve({
            name: model.name,
            model: gltf,
          })

          console.log(`%c${model.name} 読み込み完了`, logManager().styles.green)
        })
      })
    })

    Promise.all(modelPromises).then((loadedModels) => {
      console.log('%c3Dモデルの読み込みが完了しました', logManager().styles.green)

      const models = loadedModels.reduce((acc, { name, model }) => {
        acc[name] = model

        return acc
      }, {} as LoadedAssets['models'])

      resolve(models)
    })
  })

  /**
   * 環境テクスチャのローディング設定
   */
  // [HDRローダー](https://threejs.org/docs/#examples/en/loaders/RGBELoader)
  const envmapLoader = new RGBELoader(manager)

  // 環境テクスチャのローディング
  console.log('%c環境テクスチャの読み込みを開始します', logManager().styles.blue)

  const envmapLoading = new Promise<LoadedAssets['envmaps']>((resolve) => {
    const envmapPromises = assets.envmaps.map((envmap) => {
      return new Promise<{ name: string; envmap: LoadedEnvmap }>((resolve) => {
        envmapLoader.load(envmap.path, (envmapData) => {
          envmapData.mapping = THREE.EquirectangularReflectionMapping

          resolve({
            name: envmap.name,
            envmap: envmapData,
          })

          console.log(`%c${envmap.name} 読み込み完了`, logManager().styles.green)
        })
      })
    })

    Promise.all(envmapPromises).then((loadedEnvmaps) => {
      console.log('%c環境テクスチャの読み込みが完了しました', logManager().styles.green)

      const envmaps = loadedEnvmaps.reduce((acc, { name, envmap }) => {
        acc[name] = envmap

        return acc
      }, {} as LoadedAssets['envmaps'])

      resolve(envmaps)
    })
  })

  /**
   * テクスチャのローディング設定
   */
  // [テクスチャローダー](https://threejs.org/docs/?q=textureLoad#api/en/loaders/TextureLoader)
  const textureLoader = new THREE.TextureLoader(manager)

  // テクスチャのローディング
  console.log('%cテクスチャの読み込みを開始します', logManager().styles.blue)

  const textureLoading = new Promise<LoadedAssets['textures']>((resolve) => {
    const texturePromises = assets.textures.map((texture) => {
      return new Promise<{ name: string; texture: LoadedTexture }>((resolve) => {
        textureLoader.load(texture.path, (textureData) => {
          resolve({
            name: texture.name,
            texture: textureData,
          })

          console.log(`%c${texture.name} 読み込み完了`, logManager().styles.green)
        })
      })
    })

    Promise.all(texturePromises).then((loadedTextures) => {
      console.log('%cテクスチャの読み込みが完了しました', logManager().styles.green)

      const textures = loadedTextures.reduce((acc, { name, texture }) => {
        acc[name] = texture

        return acc
      }, {} as LoadedAssets['textures'])

      resolve(textures)
    })
  })

  /**
   * 全てのローディングを実行
   */
  Promise.all([
    modelLoading,
    envmapLoading,
    textureLoading,
  ]).then(([
    loadedModels,
    loadedEnvmaps,
    loadedTextures,
  ]) => {
    webglInit({
      models: loadedModels,
      envmaps: loadedEnvmaps,
      textures: loadedTextures,
    })
  })
}
