import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%'
})

export const label = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151'
})

export const value = style({
  fontSize: '0.75rem',
  color: '#6B7280',
  fontWeight: '400'
})

export const slider = style({
  width: '100%',
  height: '0.5rem',
  borderRadius: '0.25rem',
  background: '#E5E7EB',
  outline: 'none',
  cursor: 'pointer',

  '::-webkit-slider-thumb': {
    appearance: 'none',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#3B82F6',
    cursor: 'pointer',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },

  '::-moz-range-thumb': {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#3B82F6',
    cursor: 'pointer',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
})

export const description = style({
  fontSize: '0.75rem',
  color: '#6B7280',
  margin: 0,
  marginTop: '0.5rem',
  lineHeight: '1.4'
})
