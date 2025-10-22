import { style } from '@vanilla-extract/css'
import { rvw } from '@/styles/responsive.css'

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
    '@media': {
      '(max-width: 768px)': {
        width: '100%',
        position: 'relative',
        height: 'auto',
        borderLeft: 'none',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      },
    },
  },
  rvw.padding(24, 16),
  rvw.gap(24, 18),
])

export const selectSection = style([
  rvw.marginBottom(16, 12),
])

export const description = style([
  {
    color: '#6b7280',
  },
  rvw.fontSize(14, 12),
])

export const usageList = style([
  {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  rvw.gap(4, 3),
  rvw.marginLeft(8, 6),
])

export const containerHidden = style({
  transform: 'translateX(100%)',
})

export const toggleButton = style([
  {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 102,
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
