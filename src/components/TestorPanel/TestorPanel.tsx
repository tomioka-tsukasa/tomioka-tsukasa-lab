'use client'

import { GlitchPanel } from './GlitchPanel'
import { Select, Panel, Button } from './common'
import { TestorPanelProps, EffectType, GlitchSettings } from './types'
import { useState } from 'react'
import { useGlitchControl } from './hooks/useGlitchControl'
import { useWebGL } from './context/WebGLContext'
import * as styles from './TestorPanel.css'

const effectOptions = [
  { value: 'glitch', label: 'Glitch Effect' },
  { value: 'wave', label: 'Wave Effect (Coming Soon)' },
  { value: 'distortion', label: 'Distortion Effect (Coming Soon)' }
]

export const TestorPanel = ({
  effectType: initialEffectType,
  onGlitchTrigger
}: TestorPanelProps) => {
  const [selectedEffect, setSelectedEffect] = useState<EffectType>(initialEffectType)
  const [isVisible, setIsVisible] = useState(true)

  const { triggerGlitch, resetGlitch } = useGlitchControl()
  const { imageChangerNoiseCtrl } = useWebGL()

  const [settings, setSettings] = useState<GlitchSettings>({
    planeHeight: 20.0,
    ampliHeight: 1.6,
    glitchIntensity: 10.2,
    duration: 0.24,
    texture1Path: '/assets/images/samples/effect-glitch-sample-01.jpg',
    texture2Path: '/assets/images/samples/effect-glitch-sample-02.jpg'
  })

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const handleTrigger = () => {
    // 演出が完了している場合は自動リセット
    if (imageChangerNoiseCtrl && imageChangerNoiseCtrl.currentPhase === 3.0) {
      resetGlitch()
    }

    // 外部からのコールバックも呼び出す
    if (onGlitchTrigger) {
      onGlitchTrigger(settings)
    }
    // WebGLエフェクトを直接発動
    triggerGlitch(settings)
  }

  const handleReset = () => {
    resetGlitch()
  }

  // const handleGlitchTrigger = (settings: GlitchSettings) => {
  //   console.log('Glitch triggered with settings:', settings)
  //   if (onGlitchTrigger) {
  //     onGlitchTrigger(settings)
  //   }
  // }

  const renderEffectPanel = () => {
    switch (selectedEffect) {
      case 'glitch':
        return <GlitchPanel settings={settings} setSettings={setSettings} />
      case 'wave':
        return (
          <Panel title='Wave Effect'>
            <p className='text-gray-500'>Coming soon...</p>
          </Panel>
        )
      case 'distortion':
        return (
          <Panel title='Distortion Effect'>
            <p className='text-gray-500'>Coming soon...</p>
          </Panel>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className={styles.fixedControls}>
        <Button
          onClick={handleTrigger}
          size='small'
        >
          演出開始
        </Button>
        <Button
          onClick={handleReset}
          size='small'
          variant='secondary'
        >
          リセット
        </Button>
        <button
          onClick={toggleVisibility}
          className={styles.toggleButton}
          aria-label={isVisible ? 'Hide panel' : 'Show panel'}
        >
          {isVisible ? 'パネル非表示' : 'パネル表示'}
        </button>
      </div>
      <div className={`${styles.container} ${!isVisible ? styles.containerHidden : ''}`}>
        <Panel title='Effect Testor Panel'>
          <div className={styles.selectSection}>
            <Select
              label='Select Effect Type'
              value={selectedEffect}
              onChange={(value) => setSelectedEffect(value as EffectType)}
              options={effectOptions}
            />
          </div>
          <p className={styles.description}>
            このパネルでは様々なエフェクトの検証を行うことができます。
            現在は Glitch Effect が利用可能です。
          </p>
        </Panel>

        {renderEffectPanel()}

        <Panel title='Usage Info'>
          <div className={styles.description}>
            <p><strong>Glitch Effect:</strong></p>
            <ul className={styles.usageList}>
              <li>「演出開始」ボタンでグリッチエフェクトを発動</li>
              <li>Vertex Shader パラメータ（planeHeight, ampliHeight, glitchIntensity）を調整可能</li>
              <li>エフェクトの持続時間を設定可能</li>
              <li>使用するテクスチャのパスを指定可能</li>
            </ul>
          </div>
        </Panel>
      </div>
    </>
  )
}
