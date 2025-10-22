import { style } from '@vanilla-extract/css'
import { rvw } from '@/styles/responsive.css'

export const container = style([
  rvw.gap(16, 12),
  {
    display: 'flex',
    flexDirection: 'column',
  },
])

export const triggerSection = style([
  rvw.marginBottom(24, 18),
])

export const triggerButton = style({
  width: '100%',
})

export const buttonGroup = style([
  {
    display: 'flex',
    flexDirection: 'column',
  },
  rvw.gap(12, 8),
])

export const settingsGrid = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    '@media': {
      '(min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
    },
  },
  rvw.gap(16, 12),
])

export const textureSection = style([
  {
    display: 'flex',
    flexDirection: 'column',
  },
  rvw.gap(12, 8),
])
