import { hover, rvw } from '@/styles/responsive.css'
import { colors } from '@/styles/variables'
import { style, styleVariants } from '@vanilla-extract/css'

export const root = style([
  {
    width: '100%',
    height: '100%',
    borderTop: `1px solid ${colors.text.white_50}`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: colors.text.white_5,
  },
  hover({
    opacity: 0.8,
  }),
  rvw.padding([26, 17]),
  rvw.borderRadius(9),
  rvw.width(216),
])

export const arrowLine = style([
  {
    backgroundColor: colors.text.white,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
    selectors: {
      '&:first-child': {
        transform: 'translate(-50%, -50%) rotate(41.593deg)',
        left: '47%',
      },
      '&:last-child': {
        transform: 'translate(-50%, -50%) rotate(138.407deg) scaleY(-1)',
        left: '53%',
      }
    },
  },
  rvw.height(1),
  rvw.width(18),
])

export const unactive = style([
  {
    pointerEvents: 'none',
    opacity: 0.3,
  },
])

export const variants = styleVariants({
  top: [
    {
      transform: 'rotate(180deg)',
    },
  ],
  bottom: [
    {
      transform: 'rotate(0deg)',
    },
  ],
})
