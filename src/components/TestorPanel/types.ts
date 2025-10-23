export interface GlitchSettings {
  ampliHeight: number
  glitchIntensity: number
  duration: number
  texture1Path: string
  texture2Path: string
  high: number
  mid: number
  low: number
  waveSpeed: number
  basisYAxis: number
}

export type EffectType = 'glitch' | 'wave' | 'distortion'

export interface TestorPanelProps {
  effectType: EffectType
  onGlitchTrigger?: (settings: GlitchSettings) => void
  initialVisible?: boolean
}
