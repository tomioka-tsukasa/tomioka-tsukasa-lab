import { rvw } from '@/styles/responsive.css'
import { colors } from '@/styles/variables'
import { style } from '@vanilla-extract/css'

export const root = style([
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
  },
  rvw.gap(32),
])

export const bar = style([
  {
    backgroundColor: colors.text.white,
    borderRadius: 1,
    transition: 'all 0.2s ease',
  },
  rvw.height(3),
])

export const barActive = style([
  {
    opacity: 1,
  },
  rvw.width(128),
])

export const barInactive = style([
  {
    opacity: 0.4,
  },
  rvw.width(96),
])
