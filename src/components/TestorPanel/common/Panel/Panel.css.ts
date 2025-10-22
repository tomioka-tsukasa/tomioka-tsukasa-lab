import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'
import { rvw } from '@/styles/responsive.css'

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
  },
  rvw.padding(16, 12),
  rvw.paddingTop(12, 10),
  rvw.paddingBottom(12, 10),
])

export const title = style([
  {
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  rvw.fontSize(18, 16),
])

export const content = style([
  rvw.padding(16, 12),
])
