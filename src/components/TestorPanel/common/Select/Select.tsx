'use client'

import { SelectHTMLAttributes } from 'react'
import * as styles from './Select.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  className = '',
  ...props
}: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label}>{label}</label>
      <select
        value={value}
        onChange={handleChange}
        className={styles.select}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
