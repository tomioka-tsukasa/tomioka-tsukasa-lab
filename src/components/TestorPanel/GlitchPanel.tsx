'use client'

import { useState, useEffect } from 'react'
import { Button, NumberInput, FilePathInput, Panel } from './common'
import { GlitchSettings } from './types'
import { useGlitchControl } from './hooks/useGlitchControl'
import { useWebGL } from './context/WebGLContext'
import * as styles from './GlitchPanel.css'

interface GlitchPanelProps {
  onTrigger: (settings: GlitchSettings) => void
}

export const GlitchPanel = ({ onTrigger }: GlitchPanelProps) => {
  const { triggerGlitch, updateShaderParams, resetGlitch } = useGlitchControl()
  const { imageChangerNoiseCtrl } = useWebGL()

  const [settings, setSettings] = useState<GlitchSettings>({
    planeHeight: 20.0,
    ampliHeight: 1.6,
    glitchIntensity: 10.2,
    duration: 0.24,
    texture1Path: '/assets/images/samples/effect-glitch-sample-01.jpg',
    texture2Path: '/assets/images/samples/effect-glitch-sample-02.jpg'
  })

  const [previousPhase, setPreviousPhase] = useState(0)

  // 演出完了を監視して自動リセット
  useEffect(() => {
    if (!imageChangerNoiseCtrl) return

    const checkPhaseCompletion = () => {
      const currentPhase = imageChangerNoiseCtrl.currentPhase

      // フェーズが2.0（フェードアウト）から3.0（完了）に変わった時
      if (previousPhase === 2.0 && currentPhase === 3.0) {
        console.log('Glitch effect completed, ready for next trigger')
      }

      setPreviousPhase(currentPhase)
    }

    const interval = setInterval(checkPhaseCompletion, 100)

    return () => clearInterval(interval)
  }, [imageChangerNoiseCtrl, previousPhase])

  const handleTrigger = () => {
    // 演出が完了している場合は自動リセット
    if (imageChangerNoiseCtrl && imageChangerNoiseCtrl.currentPhase === 3.0) {
      resetGlitch()
    }

    // 外部からのコールバックも呼び出す
    onTrigger(settings)
    // WebGLエフェクトを直接発動
    triggerGlitch(settings)
  }

  const handleReset = () => {
    resetGlitch()
  }

  const updateSetting = <K extends keyof GlitchSettings>(
    key: K,
    value: GlitchSettings[K]
  ) => {
    const newSettings = {
      ...settings,
      [key]: value
    }
    setSettings(newSettings)

    // シェーダーパラメータは即座に更新
    if (key === 'planeHeight' || key === 'ampliHeight' || key === 'glitchIntensity') {
      updateShaderParams(newSettings)
    }
  }

  return (
    <Panel title='Glitch Effect Controls'>
      <div className={styles.container}>
        <div className={styles.triggerSection}>
          <div className={styles.buttonGroup}>
            <Button
              onClick={handleTrigger}
              size='large'
            >
              演出開始
            </Button>
            <Button
              onClick={handleReset}
              size='large'
              variant='secondary'
            >
              リセット
            </Button>
          </div>
        </div>

        <div className={styles.settingsGrid}>
          <NumberInput
            label='Plane Height'
            value={settings.planeHeight}
            onChange={(value) => updateSetting('planeHeight', value)}
            min={1}
            max={50}
            step={0.1}
          />

          <NumberInput
            label='Ampli Height'
            value={settings.ampliHeight}
            onChange={(value) => updateSetting('ampliHeight', value)}
            min={0.1}
            max={5.0}
            step={0.1}
          />

          <NumberInput
            label='Glitch Intensity'
            value={settings.glitchIntensity}
            onChange={(value) => updateSetting('glitchIntensity', value)}
            min={0.1}
            max={20.0}
            step={0.1}
          />

          <NumberInput
            label='Duration (seconds)'
            value={settings.duration}
            onChange={(value) => updateSetting('duration', value)}
            min={0.1}
            max={5.0}
            step={0.1}
          />
        </div>

        <div className={styles.textureSection}>
          <FilePathInput
            label='Texture 1 Path'
            value={settings.texture1Path}
            onChange={(value) => updateSetting('texture1Path', value)}
            placeholder='/path/to/texture1.jpg'
          />

          <FilePathInput
            label='Texture 2 Path'
            value={settings.texture2Path}
            onChange={(value) => updateSetting('texture2Path', value)}
            placeholder='/path/to/texture2.jpg'
          />
        </div>
      </div>
    </Panel>
  )
}
