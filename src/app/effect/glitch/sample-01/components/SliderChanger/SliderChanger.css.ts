import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'
import { rvw } from '@/styles/responsive.css'
import { italiana } from '@/styles/fontUtils'

export const root = style([
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  rvw.gap(70),
])

export const progressNumber = style([
  {
    color: colors.text.white,
    ...italiana()
  },
  rvw.fontSize(24),
])
