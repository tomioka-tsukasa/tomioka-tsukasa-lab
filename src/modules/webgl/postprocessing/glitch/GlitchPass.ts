import * as THREE from 'three'
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import vertexShader from './glitch.vert'
import fragmentShader from './glitch.frag'

export interface GlitchPassOptions {
  strength: number
  speed: number
  rgbOffset: number
  scanlines: number
}

export class GlitchPass extends Pass {
  private fsQuad: FullScreenQuad
  private uniforms: { [key: string]: THREE.IUniform }

  constructor(options: Partial<GlitchPassOptions> = {}) {
    super()

    const defaultOptions: GlitchPassOptions = {
      strength: 0.1,
      speed: 1.0,
      rgbOffset: 0.005,
      scanlines: 100
    }

    const settings = { ...defaultOptions, ...options }

    // シェーダーユニフォーム
    this.uniforms = {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uStrength: { value: settings.strength },
      uSpeed: { value: settings.speed },
      uRgbOffset: { value: settings.rgbOffset },
      uScanlines: { value: settings.scanlines },
      uResolution: { value: new THREE.Vector2() }
    }

    // マテリアル作成
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    })

    this.fsQuad = new FullScreenQuad(material)
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    // 入力テクスチャを設定
    this.uniforms.tDiffuse.value = readBuffer.texture

    // 時間を更新
    this.uniforms.uTime.value = performance.now() * 0.001

    // 解像度を更新
    this.uniforms.uResolution.value.set(writeBuffer.width, writeBuffer.height)

    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      this.fsQuad.render(renderer)
    } else {
      renderer.setRenderTarget(writeBuffer)
      if (this.clear) renderer.clear()
      this.fsQuad.render(renderer)
    }
  }

  // パラメータ更新メソッド
  setStrength(value: number) {
    this.uniforms.uStrength.value = value
  }

  setSpeed(value: number) {
    this.uniforms.uSpeed.value = value
  }

  setRgbOffset(value: number) {
    this.uniforms.uRgbOffset.value = value
  }

  setScanlines(value: number) {
    this.uniforms.uScanlines.value = value
  }

  dispose() {
    this.fsQuad.dispose()
  }
}
