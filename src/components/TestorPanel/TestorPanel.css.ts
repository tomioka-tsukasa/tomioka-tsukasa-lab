import { style } from '@vanilla-extract/css'

export const container = style([
  {
    width: '100%',
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    transition: 'transform 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    padding: '72px 16px 24px',
    gap: '24px',
    '@media': {
      '(max-width: 768px)': {
        width: '100%',
        position: 'relative',
        borderLeft: 'none',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      },
    },
  },
])

export const selectSection = style([
  {
    marginBottom: '16px',
  },
])

export const description = style([
  {
    color: '#6b7280',
    fontSize: '14px',
  },
])

export const usageList = style([
  {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginLeft: '8px',
  },
])

export const containerHidden = style({
  transform: 'translateX(100%)',
})

export const fixedControls = style([
  {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 102,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
])

export const toggleButton = style([
  {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    padding: '9px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#374151',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.05)',
    },
  },
])

export const controlButtons = style([
  {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
  },
])

export const progressControlSection = style({
  marginTop: '1rem',
})

export const rangeSliderSection = style({
  marginTop: '1rem',
})

export const explanationText = style({
  marginTop: '1rem',
  fontSize: '0.875rem',
})
