import { style } from '@vanilla-extract/css'

export const container = style([
  {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
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
    width: '40px',
    height: '24px',
  },
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
    width: '16px',
    height: '16px',
    top: '4px',
    left: '4px',
  },
])

export const dotActive = style([
  {
    transform: 'translateX(16px)',
  },
])

export const labelText = style([
  {
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px',
    marginLeft: '8px',
  },
])
