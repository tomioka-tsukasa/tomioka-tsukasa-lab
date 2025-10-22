'use client'

import { GlitchPanel } from './GlitchPanel'
import { Select, Panel } from './common'
import { TestorPanelProps, EffectType, GlitchSettings } from './types'
import { useState } from 'react'
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

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const handleGlitchTrigger = (settings: GlitchSettings) => {
    console.log('Glitch triggered with settings:', settings)
    if (onGlitchTrigger) {
      onGlitchTrigger(settings)
    }
  }

  const renderEffectPanel = () => {
    switch (selectedEffect) {
      case 'glitch':
        return <GlitchPanel onTrigger={handleGlitchTrigger} />
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
      <button
        onClick={toggleVisibility}
        className={styles.toggleButton}
        aria-label={isVisible ? 'Hide panel' : 'Show panel'}
      >
        {isVisible ? '非表示' : '表示'}
      </button>
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
