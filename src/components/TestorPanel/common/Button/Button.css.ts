import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'
import { rvw, hover } from '@/styles/responsive.css'

export const base = style([
  {
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    outline: 'none',
    ':focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    },
  },
  rvw.padding(16, 12),
])

export const variants = styleVariants({
  primary: [
    base,
    {
      backgroundColor: '#3b82f6',
      color: colors.base.white,
    },
    hover({
      backgroundColor: '#2563eb',
    }),
  ],
  secondary: [
    base,
    {
      backgroundColor: '#6b7280',
      color: colors.base.white,
    },
    hover({
      backgroundColor: '#4b5563',
    }),
  ],
  danger: [
    base,
    {
      backgroundColor: '#dc2626',
      color: colors.base.white,
    },
    hover({
      backgroundColor: '#b91c1c',
    }),
  ],
})

export const sizes = styleVariants({
  small: [
    rvw.padding(12, 8),
    rvw.fontSize(14, 12),
  ],
  medium: [
    rvw.padding(16, 12),
    rvw.fontSize(16, 14),
  ],
  large: [
    rvw.padding(24, 18),
    rvw.fontSize(18, 16),
  ],
})
