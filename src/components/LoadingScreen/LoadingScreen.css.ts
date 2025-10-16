import { colors } from '@/styles/variables'
import { rvw } from '@/styles/responsive.css'
import { keyframes, style } from '@vanilla-extract/css'
import { playfairDisplay } from '@/styles/fontUtils'

const blink = keyframes({
  '0%': { opacity: 1 },
  '40%': { opacity: 0.64 },
  '80%': { opacity: 1 },
  '100%': { opacity: 1 }
})

export const root = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  transition: 'opacity 0.7s cubic-bezier(0.6, 0, 0.2, 1) 0s',
})

export const text = style([
  {
    color: colors.base.white,
    fontWeight: 'bold',
    textAlign: 'center',
    animation: `${blink} 1.2s ease-in-out infinite`,
  },
  rvw.fontSize(24, 14),
  playfairDisplay(),
])

export const fadeOut = style({
  opacity: 0,
  pointerEvents: 'none',
})
