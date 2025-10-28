'use client'

import * as styles from './page.css'
import { defaultGlitchSettings, sliderData } from '../data/settings'
import { SliderChanger } from './components/SliderChanger/SliderChanger'
import { SliderProgressBar } from './components/SliderProgressBar/SliderProgressBar'
import { Title } from './components/Title/Title'
import { WebGLProvider, useWebGL } from '@/components/TestorPanel/context/WebGLContext'
import { useCallback, useEffect, useState, useRef } from 'react'
import { webglCtrl } from '@/app/effect/glitch/modules/webgl/setupMember'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

const HomePageContent = () => {
  const { imageChangerNoiseCtrl, setImageChangerNoiseCtrl } = useWebGL()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  /**
   * WebGL初期化を監視してContextに登録
   */
  useEffect(() => {
    const checkWebGL = () => {
      if (webglCtrl.imageChangerNoiseCtrl) {
        setImageChangerNoiseCtrl(webglCtrl.imageChangerNoiseCtrl)
      } else {
        setTimeout(checkWebGL, 100)
      }
    }

    checkWebGL()
  }, [setImageChangerNoiseCtrl])


  /**
   * グリッチエフェクト完了コールバック
   */
  const handleEffectCompleted = useCallback(() => {
    console.log('Glitch effect completed! (PHASE_2 reached) - Precise callback')
  }, [])

  /**
   * グリッチエフェクト完了コールバックを設定
   */
  useEffect(() => {
    if (!imageChangerNoiseCtrl) return

    // 完了コールバックを登録
    imageChangerNoiseCtrl.setOnEffectCompleted(handleEffectCompleted)

    return () => {
      // クリーンアップ
      imageChangerNoiseCtrl.setOnEffectCompleted(null)
    }
  }, [imageChangerNoiseCtrl, handleEffectCompleted])

  /**
   * GSAP アニメーション付きスライド切り替え
   */
  const navigateToSlide = useCallback((targetIndex: number) => {
    if (targetIndex === currentSlideIndex) return

    const currentSlide = sliderData[currentSlideIndex]
    const targetSlide = sliderData[targetIndex]

    if (!imageChangerNoiseCtrl || !currentSlide || !targetSlide) return

    // 進行中のアニメーションがあれば停止
    if (animationRef.current) {
      animationRef.current.kill()
    }

    // 自動更新を確実に停止
    imageChangerNoiseCtrl.resetGlitch()

    // テクスチャ設定
    const currentTextureKey = currentSlide.imagePath
    const targetTextureKey = targetSlide.imagePath
    imageChangerNoiseCtrl.setTextures(currentTextureKey, targetTextureKey)

    // GSAPアニメーション開始
    const target = {
      textureProgress: 0,
      glitchProgress: 0
    }

    animationRef.current = gsap.to(target, {
      duration: defaultGlitchSettings.duration,
      textureProgress: 1,
      glitchProgress: 1,
      ease: 'none', // ベースのイージングなし
      onUpdate: () => {
        // テクスチャ進行度: 直線的な0.0→1.0
        const textureEased = gsap.parseEase(CustomEase.create('circ.in'))(target.textureProgress)

        // グリッチ進行度: カスタムイージング（山なり）
        const glitchEased = gsap.parseEase(CustomEase.create('custom', 'M0,0 C0.37,0.92 0.626,0.995 0.7,0.952 0.806,0.889 0.92,0.432 1,0'))(target.glitchProgress)

        // Fragment Shader: textureEased, Vertex Shader: glitchEased
        imageChangerNoiseCtrl.setManualProgress?.(textureEased, glitchEased)
      },
      onComplete: () => {
        // 最終状態を確実に設定
        imageChangerNoiseCtrl.setManualProgress?.(1.0, 0.0)
        animationRef.current = null
      }
    })

    // スライドインデックス更新
    setCurrentSlideIndex(targetIndex)
  }, [currentSlideIndex, imageChangerNoiseCtrl])

  /**
   * 前のスライドに切り替え
   */
  const sliderChangePrev = useCallback(() => {
    const prevIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : sliderData.length - 1
    navigateToSlide(prevIndex)
  }, [currentSlideIndex, navigateToSlide])

  /**
   * 次のスライドに切り替え
   */
  const sliderChangeNext = useCallback(() => {
    const nextIndex = currentSlideIndex < sliderData.length - 1 ? currentSlideIndex + 1 : 0
    navigateToSlide(nextIndex)
  }, [currentSlideIndex, navigateToSlide])

  /**
   * スライド切り替え
   */
  const handleSlideChange = useCallback((slideIndex: number) => {
    navigateToSlide(slideIndex)
  }, [navigateToSlide])

  /**
   * レンダリング
   */
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Title
          number={String(currentSlideIndex + 1).padStart(2, '0')}
          titleEn={sliderData[currentSlideIndex]?.titleEn || 'Production system'}
          title={sliderData[currentSlideIndex]?.title || 'ボカロやCover動画のMVイラストを描きます。'}
        />
      </div>
      <div className={styles.sliderChanger}>
        <SliderChanger current={currentSlideIndex + 1} total={sliderData.length} onPrev={sliderChangePrev} onNext={sliderChangeNext} />
      </div>
      <div className={styles.sliderProgressBar}>
        <SliderProgressBar
          currentIndex={currentSlideIndex}
          totalCount={sliderData.length}
          onSlideChange={handleSlideChange}
        />
      </div>
    </div>
  )
}

const HomePage = () => {
  return (
    <WebGLProvider>
      <HomePageContent />
    </WebGLProvider>
  )
}

export default HomePage
