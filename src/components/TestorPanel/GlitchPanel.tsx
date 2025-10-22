'use client'

import { NumberInput, FilePathInput, Panel } from './common'
import { GlitchSettings } from './types'
import { useGlitchControl } from './hooks/useGlitchControl'
import * as styles from './GlitchPanel.css'

interface GlitchPanelProps {
  onTrigger: (settings: GlitchSettings) => void
  settings: GlitchSettings
  setSettings: React.Dispatch<React.SetStateAction<GlitchSettings>>
}

export const GlitchPanel = ({ onTrigger, settings, setSettings }: GlitchPanelProps) => {
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
    if (key === 'planeHeight' || key === 'ampliHeight' || key === 'glitchIntensity') {
      updateShaderParams(newSettings)
    }
  }

  return (
    <Panel title='Glitch Effect Controls'>
      <div className={styles.container}>
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
