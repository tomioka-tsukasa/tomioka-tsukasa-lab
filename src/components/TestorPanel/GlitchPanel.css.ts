import { style } from '@vanilla-extract/css'

export const container = style([
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
])

export const triggerSection = style([
  {
    marginBottom: '24px',
  },
])

export const triggerButton = style({
  width: '100%',
})

export const buttonGroup = style([
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
])

export const settingsGrid = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '16px',
    '@media': {
      '(min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
    },
  },
])

export const textureSection = style([
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
])
