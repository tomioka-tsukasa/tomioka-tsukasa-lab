import { GlitchSettings } from '@/components/TestorPanel/types'

export const defaultGlitchSettings: GlitchSettings = {
  ampliHeight: 1.6,
  glitchIntensity: 2.0,
  duration: 0.4,
  texture1Path: '/assets/images/samples/effect-glitch-sample-01.jpg',
  texture2Path: '/assets/images/samples/effect-glitch-sample-02.jpg',
  high: 6.0,
  mid: 3.0,
  low: 1.0,
  waveSpeed: 1.0,
  basisYAxis: 0.0,
  manualProgress: true,
  progressValue: 0.0,
  progressMode: 'oneway'
}

export interface SliderItem {
  id: number
  titleEn: string
  title: string
  imagePath: string
}

export const sliderData: SliderItem[] = [
  {
    id: 1,
    titleEn: 'Graco Illust Work.',
    title: 'Graco 10周年記念 のイラストワーク',
    imagePath: 'sample-01'
  },
  {
    id: 2,
    titleEn: 'Ms. Yoshimi Thanks Illust.',
    title: '「Yoshimi」氏への感謝のイラストワーク',
    imagePath: 'sample-02'
  },
  {
    id: 3,
    titleEn: 'Graco Illust Work.',
    title: 'Graco 10周年記念 のイラストワーク',
    imagePath: 'sample-03'
  }
]
