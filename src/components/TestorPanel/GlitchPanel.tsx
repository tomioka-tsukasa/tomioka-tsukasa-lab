'use client'

import { NumberInput, FilePathInput, Panel } from './common'
import { GlitchSettings } from './types'
import { useGlitchControl } from './hooks/useGlitchControl'
import * as styles from './GlitchPanel.css'

interface GlitchPanelProps {
  settings: GlitchSettings
  setSettings: React.Dispatch<React.SetStateAction<GlitchSettings>>
}

export const GlitchPanel = ({ settings, setSettings }: GlitchPanelProps) => {
  const { updateShaderParams } = useGlitchControl()

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
    if (key === 'ampliHeight' || key === 'glitchIntensity' || key === 'high' || key === 'mid' || key === 'low' || key === 'waveSpeed' || key === 'basisYAxis') {
      updateShaderParams(newSettings)
    }
  }

  return (
    <Panel title='Glitch Effect Controls'>
      <div className={styles.container}>
        <div className={styles.settingsGrid}>
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

        <div className={styles.settingsGrid}>
          <NumberInput
            label='High Frequency'
            value={settings.high}
            onChange={(value) => updateSetting('high', value)}
            min={0.1}
            max={20.0}
            step={0.1}
          />

          <NumberInput
            label='Mid Frequency'
            value={settings.mid}
            onChange={(value) => updateSetting('mid', value)}
            min={0.1}
            max={20.0}
            step={0.1}
          />

          <NumberInput
            label='Low Frequency'
            value={settings.low}
            onChange={(value) => updateSetting('low', value)}
            min={0.1}
            max={20.0}
            step={0.1}
          />

          <NumberInput
            label='Wave Speed'
            value={settings.waveSpeed}
            onChange={(value) => updateSetting('waveSpeed', value)}
            min={0.1}
            max={10.0}
            step={0.1}
          />

          <NumberInput
            label='Basis Y-Axis (0=uniform, 1=distance based)'
            value={settings.basisYAxis}
            onChange={(value) => updateSetting('basisYAxis', value)}
            min={0.0}
            max={1.0}
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
