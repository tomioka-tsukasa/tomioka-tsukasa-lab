import { style } from '@vanilla-extract/css'
import { rvw } from '@/styles/responsive.css'

export const container = style([
  {
    display: 'flex',
    alignItems: 'center',
  },
  rvw.gap(8, 6),
])

export const label = style({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
})

export const hiddenInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
})

export const track = style([
  {
    display: 'block',
    borderRadius: '9999px',
    transition: 'background-color 0.2s ease-in-out',
  },
  rvw.width(40, 36),
  rvw.height(24, 20),
])

export const trackActive = style({
  backgroundColor: '#3b82f6',
})

export const trackInactive = style({
  backgroundColor: '#d1d5db',
})

export const dot = style([
  {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'transform 0.2s ease-in-out',
  },
  rvw.width(16, 14),
  rvw.height(16, 14),
  rvw.top(4, 3),
  rvw.left(4, 3),
])

export const dotActive = style([
  rvw.transform('translateX(16px)', 'translateX(14px)'),
])

export const labelText = style([
  {
    fontWeight: '500',
    color: '#374151',
  },
  rvw.fontSize(14, 12),
  rvw.marginLeft(8, 6),
])
