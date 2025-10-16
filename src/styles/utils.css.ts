import { style } from '@vanilla-extract/css'
import { sp } from './responsive.css'

export const pcOnly = style([
  {
    display: 'block',
  },
  sp({
    display: 'none',
  }),
])

export const spOnly = style([
  {
    display: 'none',
  },
  sp({
    display: 'block',
  }),
])
