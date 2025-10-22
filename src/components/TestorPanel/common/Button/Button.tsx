'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import * as styles from './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.variants[variant]} ${styles.sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
