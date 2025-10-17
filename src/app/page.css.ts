import { style } from '@vanilla-extract/css'
import { rvw } from '@/styles/responsive.css'

export const root = style([
  rvw.fontSize(16),
])

export const heading = style([
  rvw.fontSize(24),
  rvw.marginBottom(20),
])

export const section = style([
  rvw.paddingBottom(160),
])
