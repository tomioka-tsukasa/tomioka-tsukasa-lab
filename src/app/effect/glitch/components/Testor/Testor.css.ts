import { style } from '@vanilla-extract/css'

export const container = style([
  {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    '@media': {
      '(max-width: 768px)': {
        width: '80vw',
      },
    },
  },
])
