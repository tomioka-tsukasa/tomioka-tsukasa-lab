import type { StyleRule } from '@vanilla-extract/css'

// フォントファミリーの基本定義
export const basicFontStyle = '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif'
export const notoSansStyle = `'Noto Sans JP', ${basicFontStyle}`
export const zenKakuGothicNewStyle = 'var(--font-zen-kaku-gothic-new)'
export const playfairDisplayStyle = 'var(--font-playfair-display)'
export const italianaStyle = 'var(--font-italiana)'
export const bungeeHairlineStyle = 'var(--font-bungee-hairline)'

// フォントスタイル適用関数
export type SetFontFamily = (
  option?: {
    weight?: number,
    style?: string,
  }
) => StyleRule

export const zenKakuGothicNew: SetFontFamily = (option = {
  weight: 400,
  style: 'normal',
}) => {
  return {
    fontFamily: zenKakuGothicNewStyle,
    fontOpticalSizing: 'auto',
    fontWeight: option.weight,
    fontStyle: option.style,
    WebkitTextSizeAdjust: '100%',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    fontFeatureSettings: '"palt"',
  }
}

export const playfairDisplay: SetFontFamily = (option = {
  weight: 400,
  style: 'normal',
}) => {
  return {
    fontFamily: playfairDisplayStyle,
    fontOpticalSizing: 'auto',
    fontWeight: option.weight,
    fontStyle: option.style,
    WebkitTextSizeAdjust: '100%',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }
}

export const italiana: SetFontFamily = (option = {
  weight: 400,
  style: 'normal',
}) => {
  return {
    fontFamily: italianaStyle,
    fontOpticalSizing: 'auto',
    fontWeight: option.weight,
    fontStyle: option.style,
    WebkitTextSizeAdjust: '100%',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }
}

export const bungeeHairline: SetFontFamily = (option = {
  weight: 400,
  style: 'normal',
}) => {
  return {
    fontFamily: bungeeHairlineStyle,
    fontOpticalSizing: 'auto',
    fontWeight: option.weight,
    fontStyle: option.style,
    WebkitTextSizeAdjust: '100%',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }
}
