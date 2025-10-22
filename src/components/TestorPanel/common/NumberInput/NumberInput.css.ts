import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'
import { rvw } from '@/styles/responsive.css'

export const container = style([
  {
    display: 'flex',
    flexDirection: 'column',
  },
  rvw.gap(4, 3),
])

export const label = style([
  {
    fontWeight: '500',
    color: '#374151',
  },
  rvw.fontSize(14, 12),
])

export const input = style([
  {
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: colors.base.white,
    color: colors.base.black,
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    ':focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 1px #3b82f6',
    },
  },
  rvw.padding(12, 8),
  rvw.fontSize(16, 14),
])

export const rangeText = style([
  {
    color: '#6b7280',
  },
  rvw.fontSize(12, 10),
])
