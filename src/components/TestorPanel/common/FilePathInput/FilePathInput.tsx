'use client'

import { InputHTMLAttributes } from 'react'
import * as styles from './FilePathInput.css'

interface FilePathInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const FilePathInput = ({
  label,
  value,
  onChange,
  placeholder = 'Enter file path...',
  className = '',
  ...props
}: FilePathInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label}>{label}</label>
      <input
        type='text'
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.input}
        {...props}
      />
    </div>
  )
}
