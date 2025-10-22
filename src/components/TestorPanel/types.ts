export interface GlitchSettings {
  planeHeight: number
  ampliHeight: number
  glitchIntensity: number
  duration: number
  texture1Path: string
  texture2Path: string
}

export type EffectType = 'glitch' | 'wave' | 'distortion'

export interface TestorPanelProps {
  effectType: EffectType
  onGlitchTrigger?: (settings: GlitchSettings) => void
}
