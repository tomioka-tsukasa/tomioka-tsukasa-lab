import { rvw } from '@/styles/responsive.css'
import { colors } from '@/styles/variables'
import { style } from '@vanilla-extract/css'
import { italiana, zenKakuGothicNew } from '@/styles/fontUtils'

export const root = style([
  {
    position: 'relative',
  },
])

export const number = style([
  {
    lineHeight: 1,
    color: colors.text.white,
    ...italiana()
  },
  rvw.fontSize(24),
])

export const titleEn = style([
  {
    lineHeight: 1,
    color: colors.text.white_80,
    ...italiana()
  },
  rvw.fontSize(80),
  rvw.marginTop(3),
])

export const title = style([
  {
    lineHeight: 1.28,
    color: colors.text.white_80,
    ...zenKakuGothicNew()
  },
  rvw.fontSize(14),
  rvw.marginTop(9),
])
