'use client'

import { InputHTMLAttributes } from 'react'
import * as styles from './NumberInput.css'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export const NumberInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  className = '',
  ...props
}: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label}>{label}</label>
      <input
        type='number'
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={styles.input}
        {...props}
      />
      {min !== undefined && max !== undefined && (
        <span className={styles.rangeText}>
          Range: {min} - {max}
        </span>
      )}
    </div>
  )
}
