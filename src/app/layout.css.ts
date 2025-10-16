import { style } from '@vanilla-extract/css'

export const canvasContainer = style({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  position: 'fixed',
  zIndex: 0,
  top: 0,
  left: 0,
})

export const canvasInner = style({
  width: '100%',
  height: '100%',
  position: 'relative',
  zIndex: 0,
})

export const canvas = style([
  {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
])

export const canvasMask = style([
  {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
])
