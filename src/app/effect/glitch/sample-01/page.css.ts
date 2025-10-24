import { rvw } from '@/styles/responsive.css'
import { style } from '@vanilla-extract/css'

export const root = style([
  {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
])

export const title = style([
  {
    position: 'absolute',
  },
  rvw.bottom(70),
  rvw.left(96),
])

export const sliderProgressBar = style([
  {
    position: 'absolute',
    top: '48%',
    transform: 'translateY(-50%)',
  },
  rvw.left(96),
])

export const sliderChanger = style([
  {
    position: 'absolute',
    top: '48%',
    transform: 'translateY(-50%)',
  },
  rvw.right(96),
])
