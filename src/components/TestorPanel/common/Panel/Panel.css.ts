import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'

export const container = style([
  {
    backgroundColor: colors.base.white,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
  },
])

export const header = style([
  {
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 16px',
  },
])

export const title = style([
  {
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    fontSize: '18px',
  },
])

export const content = style([
  {
    padding: '16px',
  },
])
