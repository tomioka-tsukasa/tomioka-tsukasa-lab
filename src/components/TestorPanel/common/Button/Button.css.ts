import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/variables'
import { hover } from '@/styles/responsive.css'

export const base = style([
  {
    border: 'none',
    borderRadius: '3px',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    outline: 'none',
    padding: '12px 24px',
    ':focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    },
  },
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
    {
      padding: '6px 12px',
      fontSize: '14px',
    },
  ],
  medium: [
    {
      padding: '8px 16px',
      fontSize: '16px',
    },
  ],
  large: [
    {
      padding: '12px 24px',
      fontSize: '18px',
    },
  ],
})
