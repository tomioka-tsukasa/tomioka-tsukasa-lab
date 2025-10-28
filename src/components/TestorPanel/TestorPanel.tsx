'use client'

import { GlitchPanel } from './GlitchPanel'
import { Select, Panel, Button, RangeSlider, Toggle } from './common'
import { TestorPanelProps, EffectType, GlitchSettings } from './types'
import { useState } from 'react'
import { useGlitchControl } from './hooks/useGlitchControl'
import { useWebGL } from './context/WebGLContext'
import { defaultGlitchSettings } from '@/app/effect/glitch/data/settings'
import * as styles from './TestorPanel.css'

const effectOptions = [
  { value: 'glitch', label: 'Glitch Effect' },
  { value: 'wave', label: 'Wave Effect (Coming Soon)' },
  { value: 'distortion', label: 'Distortion Effect (Coming Soon)' }
]

export const TestorPanel = ({
  effectType: initialEffectType,
  onGlitchTrigger,
  initialVisible = true
}: TestorPanelProps) => {
  const [selectedEffect, setSelectedEffect] = useState<EffectType>(initialEffectType)
  const [isVisible, setIsVisible] = useState(initialVisible)

  const { triggerGlitch, resetGlitch, setManualProgress } = useGlitchControl()
  const { imageChangerNoiseCtrl } = useWebGL()

  const [settings, setSettings] = useState<GlitchSettings>(defaultGlitchSettings)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const handleTrigger = () => {
    // 演出が完了している場合は自動リセット
    if (imageChangerNoiseCtrl && imageChangerNoiseCtrl.currentPhase === 3.0) {
      resetGlitch()
    }

    // マニュアルモードを無効化して自動演出開始
    setSettings(prev => ({ ...prev, manualProgress: false }))

    // 外部からのコールバックも呼び出す
    if (onGlitchTrigger) {
      onGlitchTrigger(settings)
    }
    // WebGLエフェクトを直接発動
    triggerGlitch(settings)
  }

  const handleReset = () => {
    setSettings(prev => ({ ...prev, manualProgress: false, progressValue: 0.0 }))
    resetGlitch()
  }

  const handleProgressChange = (value: number) => {
    setSettings(prev => {
      const newSettings = { ...prev, progressValue: value }
      if (setManualProgress) {
        setManualProgress(value)
      }

      return newSettings
    })
  }

  const handleManualModeToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, manualProgress: enabled }))
    if (!enabled) {
      // マニュアルモード無効時はリセット
      handleReset()
    }
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
            <p>Coming soon...</p>
          </Panel>
        )
      case 'distortion':
        return (
          <Panel title='Distortion Effect'>
            <p>Coming soon...</p>
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
          {isVisible ? '設定パネル非表示' : '設定パネル表示'}
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

        <Panel title='Progress Control'>
          <div className={styles.description}>
            <Toggle
              label='Manual Progress Control'
              checked={settings.manualProgress}
              onChange={handleManualModeToggle}
            />
            {settings.manualProgress && (
              <div className={styles.progressControlSection}>
                {/* Progress Mode選択は削除（Oneway固定） */}
                <div className={styles.rangeSliderSection}>
                  <RangeSlider
                    label='Glitch Progress'
                    value={settings.progressValue}
                    onChange={handleProgressChange}
                    min={0}
                    max={1}
                    step={0.01}
                    description='0.0 = 完全に01, 1.0 = 完全に02'
                  />
                </div>
              </div>
            )}
            <p className={styles.explanationText}>
              <strong>操作説明:</strong><br />
              • Manual Progress Controlを有効にするとスライダーで演出進行度を手動制御<br />
              • 進行度がそのままglitch_progressに対応（0.0=完全に01, 1.0=完全に02）<br />
              • 「演出開始」ボタンは自動モードで通常の演出を実行
            </p>
          </div>
        </Panel>

        {renderEffectPanel()}

        <Panel title='Usage Info'>
          <div className={styles.description}>
            <p><strong>Glitch Effect:</strong></p>
            <ul className={styles.usageList}>
              <li>「演出開始」ボタンでグリッチエフェクトを発動</li>
              <li>Vertex Shader パラメータ（ampliHeight, glitchIntensity）を調整可能</li>
              <li>Wave パラメータ（high, mid, low, waveSpeed, basisYAxis）を調整可能</li>
              <li>エフェクトの持続時間を設定可能</li>
              <li>使用するテクスチャのパスを指定可能</li>
            </ul>
          </div>
        </Panel>
      </div>
    </>
  )
}
