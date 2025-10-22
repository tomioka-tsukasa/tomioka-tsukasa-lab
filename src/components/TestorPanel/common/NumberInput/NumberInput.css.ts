import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'

export const container = style([
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
])

export const label = style([
  {
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px',
  },
])

export const input = style([
  {
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: colors.base.white,
    color: colors.base.black,
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    fontSize: '16px',
    padding: '12px',
    ':focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 1px #3b82f6',
    },
  },
])

export const rangeText = style([
  {
    color: '#6b7280',
    fontSize: '12px',
  },
])
