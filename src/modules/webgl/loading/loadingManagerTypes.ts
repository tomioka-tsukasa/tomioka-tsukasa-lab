import { LoadedAssets, LoadingAssets } from '../setupMember'

/**
 * ローディングマネージャー
 */
export type LoadingManager = (
  webglInit: (
    loadedAssets: LoadedAssets,
  ) => void,
  assets: LoadingAssets,
) => Promise<void>

/**
 * WebGLセットアップ時に設定するオブジェクト
 */
export type LoadingObject = {
  name: string,
  path: string,
}

export type LoadingObjects = Array<LoadingObject>
