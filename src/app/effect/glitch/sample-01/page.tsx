'use client'

import * as styles from './page.css'
import { defaultGlitchSettings, sliderData } from '../data/settings'
import { SliderChanger } from './components/SliderChanger/SliderChanger'
import { SliderProgressBar } from './components/SliderProgressBar/SliderProgressBar'
import { Title } from './components/Title/Title'
import { useGlitchControl } from '@/components/TestorPanel/hooks/useGlitchControl'
import { WebGLProvider, useWebGL } from '@/components/TestorPanel/context/WebGLContext'
import { useCallback, useEffect, useState } from 'react'
import { webglCtrl } from '@/app/effect/glitch/modules/webgl/setupMember'

const HomePageContent = () => {
  const { triggerGlitch, resetGlitch } = useGlitchControl()
  const { imageChangerNoiseCtrl, setImageChangerNoiseCtrl } = useWebGL()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

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
   * 初期テクスチャ設定（WebGL初期化時のみ）
   */
  useEffect(() => {
    if (!imageChangerNoiseCtrl) return

    // 初期状態: sample-01表示、次回sample-02に備える
    const currentSlide = sliderData[0] // 最初のスライド
    const nextSlideIndex = 1 % sliderData.length
    const nextSlide = sliderData[nextSlideIndex]

    if (currentSlide && nextSlide) {
      imageChangerNoiseCtrl.setTextures(currentSlide.imagePath, nextSlide.imagePath)
      console.log(`Initial texture setup: ${currentSlide.imagePath} -> ${nextSlide.imagePath}`)
    }
  }, [imageChangerNoiseCtrl])

  /**
   * グリッチエフェクト完了コールバック
   */
  const handleEffectCompleted = useCallback(() => {
    console.log('Glitch effect completed! (PHASE_2 reached) - Precise callback')

    resetGlitch()

    // 次回切り替え用のテクスチャ準備
    if (imageChangerNoiseCtrl) {
      const currentSlide = sliderData[currentSlideIndex]
      const nextSlideIndex = (currentSlideIndex + 1) % sliderData.length
      const nextSlide = sliderData[nextSlideIndex]

      if (currentSlide && nextSlide) {
        // 現在表示中のテクスチャと次に切り替える予定のテクスチャを設定
        imageChangerNoiseCtrl.setTextures(currentSlide.imagePath, nextSlide.imagePath)
        console.log(`Next texture prepared: ${currentSlide.imagePath} -> ${nextSlide.imagePath}`)
      }
    }
  }, [resetGlitch, imageChangerNoiseCtrl, currentSlideIndex])

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
   * スライド切り替え
   */
  const navigateToSlide = useCallback((targetIndex: number) => {
    if (targetIndex === currentSlideIndex) return

    const currentSlide = sliderData[currentSlideIndex]
    const targetSlide = sliderData[targetIndex]

    if (!imageChangerNoiseCtrl || !currentSlide || !targetSlide) return

    // テクスチャキーを直接使用（sample-01, sample-02, sample-03）
    const currentTextureKey = currentSlide.imagePath
    const targetTextureKey = targetSlide.imagePath

    // 現在のテクスチャから次のテクスチャへの切り替え設定
    imageChangerNoiseCtrl.setTextures(currentTextureKey, targetTextureKey)

    // グリッチエフェクト開始
    triggerGlitch(defaultGlitchSettings)

    // スライドインデックス更新
    setCurrentSlideIndex(targetIndex)
  }, [currentSlideIndex, imageChangerNoiseCtrl, triggerGlitch])

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
