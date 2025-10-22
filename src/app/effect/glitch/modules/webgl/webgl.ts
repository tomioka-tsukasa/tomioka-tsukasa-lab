import * as THREE from 'three'

// セットアップ
import { getCamera, getControls, getRenderer, getCameraInfo } from '@/modules/webgl/setup/setup'
import { loadingAssets, setupMember, webglCtrl } from './setupMember'
import { CreateWebGL, InitWebGL } from '@/modules/webgl/webglTypes'

// メッシュ
import { imageChangerNoise } from './mesh/imageChangerNoise/imageChangerNoise'

// ポストプロセッシング
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GlitchPass } from '@/modules/webgl/postprocessing/glitch/GlitchPass'

// パフォーマンス
import Stats from 'stats.js'
import { setFpsManager } from '@/lib/threejs/setFpsManager/setFpsManager'

// ローディング
import { loadingManager } from '@/modules/webgl/loading/loadingManager'

// GUI
import { setSceneGUI } from '@/modules/webgl/gui/setter/scene/setSceneGUI'
import { setCameraGUI } from '@/modules/webgl/gui/setter/camera/setCameraGUI'
import { setPostprocessGUI } from '@/modules/webgl/gui/setter/postprocess/setPostprocessGUI'
import { fixCamerawork } from '@/lib/threejs/fixCamerawork/fixCamerawork'

/**
 * 【WebGLの初期化】
 * ・全ての処理が完了した後に loadingComplete を呼び出す
 * ・グローバルストア等で完了通知を行う想定
 */
const initWebGL: InitWebGL = (
  loadingComplete,
  loadedAssets,
  onWebGLReady?,
) => {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement

  if (!canvas) {
    console.error('canvas not found')

    return
  }

  /**
   * Stats
   */
  const stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  if (setupMember.gui.stats) {
    document.body.appendChild(stats.dom)
  }

  /**
   * FPSマネージャー
   */
  const fpsManager = setFpsManager(
    setupMember.renderer.targetFps,
    {
      log: setupMember.renderer.fpsLog,
    },
  )

  /**
   * シーン
   */
  const scene = new THREE.Scene()
  if (setupMember.scene.environment) {
    // シーン設定
    scene.environment = loadedAssets.envmaps[setupMember.scene.environment] || null
    scene.background = setupMember.scene.background ? loadedAssets.envmaps[setupMember.scene.environment] : null
    scene.environmentIntensity = setupMember.scene.environmentIntensity

    // シーンのGUI設定
    setSceneGUI(
      scene,
      loadedAssets.envmaps[setupMember.scene.environment],
      {
        environmentIntensity: setupMember.scene.environmentIntensity,
        background: setupMember.scene.background,
      },
    )
  }

  /**
   * レンダラー
   */
  const renderer = getRenderer(
    canvas,
    setupMember.renderer,
  )

  /**
   * カメラ設定
   */
  const cameraWork = fixCamerawork(
    setupMember.camera.default.position,
    setupMember.camera.default.target,
    setupMember.camera.default.rotation,
  )

  const camera = getCamera({
    position: cameraWork.position,
  })
  const controls = getControls(
    camera,
    renderer,
    cameraWork.target,
  )
  setCameraGUI(camera, cameraWork)

  // カメラの動きをログに出力
  getCameraInfo(camera, controls)

  // カメラをシーンに追加
  scene.add(
    camera,
  )

  /**
   * 光源設定
   */


  /**
   * 環境光設定
   */


  /**
   * メッシュ設定
   */
  // const mesh = (() => {
  //   const geo = new THREE.PlaneGeometry(20, 20, 1, 1)

  //   const mat = new THREE.ShaderMaterial({
  //     vertexShader: `
  //     uniform float u_time;
  //     varying vec2 vUv;
  //     varying vec2 vPosition;

  //     void main() {
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //       vUv = uv;
  //       vPosition = vec2(position.x, position.y);
  //     }
  //     `,
  //     fragmentShader: `
  //     varying vec2 vUv;
  //     uniform float u_time;
  //     uniform sampler2D u_texture_01;
  //     uniform sampler2D u_texture_02;
  //     varying vec2 vPosition;

  //     float random(float x) {
  //       return fract(sin(x * 12.9898) * 43758.5453);
  //     }

  //     float random2d(vec2 st) {
  //       return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  //     }

  //     void main() {
  //       // ステップ1: 2つのテクスチャをサンプリング
  //       vec3 texture1 = texture2D(u_texture_01, vUv).rgb;
  //       vec3 texture2 = texture2D(u_texture_02, vUv).rgb;

  //       // ステップ2: 切り替えパラメータ追加が必要
  //       // uniform float u_transition; // 0.0 = 1枚目、1.0 = 2枚目
  //       float transition = sin(u_time * 1.5) * .5 + .5;

  //       // ステップ3: 基本的な切り替え（フェード）
  //       vec3 simpleTransition = mix(texture1, texture2, transition);

  //       // ステップ4: ランダム切り替えの仕組み
  //       float pixelRandom = random2d(vUv * 100.0); // ピクセルごとのランダム値
  //       float threshold = transition; // 切り替えの閾値

  //       // ステップ5: step関数を使って判定
  //       float mask = step(pixelRandom, threshold);
  //       vec3 randomTransition = mix(texture1, texture2, mask);

  //       // ステップ6: グリッド単位でランダムにする場合
  //       // vec2 grid = floor(vUv * 10.0);
  //       // float gridRandom = random2d(grid);
  //       // float gridMask = step(gridRandom, threshold);

  //       vec3 color = randomTransition; // 仮の色
  //       gl_FragColor = vec4(color, 1.0);
  //     }
  //     `,
  //     uniforms: {
  //       u_time: { value: 0 },
  //       u_texture_01: { value: loadedAssets.textures['sample-01'] },
  //       u_texture_02: { value: loadedAssets.textures['sample-02'] },
  //     },
  //     wireframe: false,
  //     side: THREE.DoubleSide,
  //   })

  //   const mesh = new THREE.Mesh(geo, mat)

  //   console.log(mesh)

  //   return mesh
  // })()
  // mesh.position.set(0, 10, 0)

  const imageChangerNoiseCtrl = imageChangerNoise(loadedAssets)

  /**
   * グリッドヘルパー
   */
  // const gridHelper = new THREE.GridHelper(100, 100)

  /**
   * シーン追加
   */
  scene.add(
    camera,
    // gridHelper,
    imageChangerNoiseCtrl.mesh,
  )

  /**
   * ポストプロセッシング
   */
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), // サイズ
    setupMember.postprocess.bloomPass.strength, // 強さ
    setupMember.postprocess.bloomPass.radius, // ブルームの半径
    setupMember.postprocess.bloomPass.threshold, // ブルームの強さ
  )
  if (setupMember.postprocess.bloomPass.active) {
    composer.addPass(bloomPass)
  }

  // グリッチパス
  const glitchPass = new GlitchPass({
    strength: setupMember.postprocess.glitchPass.strength,
    speed: setupMember.postprocess.glitchPass.speed,
    rgbOffset: setupMember.postprocess.glitchPass.rgbOffset,
    scanlines: setupMember.postprocess.glitchPass.scanlines,
  })
  if (setupMember.postprocess.glitchPass.active) {
    composer.addPass(glitchPass)
  }

  // GUI設定
  if (setupMember.gui.active) setPostprocessGUI(
    bloomPass,
    {
      bloomPass: setupMember.postprocess.bloomPass
    },
  )

  /**
   * アニメーション
   */
  // let prevTime = performance.now()
  // const targetFPS = 60

  const renderProcess = () => {
    if (setupMember.postprocess.active) {
      // ポストプロセッシングレンダリングを実行
      composer.render()
    } else {
      // 通常レンダリングを実行
      renderer.render(scene, camera)
    }
  }

  if (!setupMember.renderer.active) {
    fpsManager.rendering(0, renderProcess)
  }

  function animate(
    timestamp: number,
  ) {
    // レンダリングを停止している場合はアニメーションを停止
    if (!setupMember.renderer.active) {
      return
    }

    /**
     * パフォーマンス管理
     */
    stats.begin()
    // const currentTime = performance.now()
    // const delta = (currentTime - prevTime) / 1000 // 秒単位
    // const deltaFPS = delta * targetFPS
    // prevTime = currentTime

    /**
     * サンプルメッシュの状態管理
     */
    imageChangerNoiseCtrl.update()

    /**
     * アップデート関数
     */
    controls.update()
    controls.enabled = setupMember.controls.enabled
    controls.autoRotate = setupMember.controls.autoRotate

    /**
     * レンダリング
     */
    fpsManager.rendering(timestamp, renderProcess)

    /**
     * パフォーマンス
     */
    stats.end()
  }
  renderer.setAnimationLoop(animate)

  /**
   * 管理オブジェクト設定
   */
  webglCtrl.renderer = renderer
  webglCtrl.camera = camera
  webglCtrl.scene = scene
  webglCtrl.envmaps = loadedAssets.envmaps
  webglCtrl.textures = loadedAssets.textures
  webglCtrl.controls = controls
  webglCtrl.imageChangerNoiseCtrl = imageChangerNoiseCtrl

  // WebGLコンテキストに登録
  if (onWebGLReady) {
    onWebGLReady(imageChangerNoiseCtrl)
  }

  /**
   * 初期化完了通知
   */
  loadingComplete()
}

/**
 * 【WebGLを生成】
 * ・<Canvas /> コンポーネントで一度だけ実行される想定
 * ・モデル等全てのローディングを loadingManager で処理した後に initWebGL を実行
 */
export const createWebGL: CreateWebGL = (
  loadingComplete,
  onWebGLReady?,
) => {
  if (!window) return

  loadingManager(
    (loadedAssets) => {
      initWebGL(
        loadingComplete,
        loadedAssets,
        onWebGLReady,
      )
    },
    loadingAssets,
  )
}
