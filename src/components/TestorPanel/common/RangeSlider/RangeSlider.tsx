'use client'

import { ChangeEvent } from 'react'
import * as styles from './RangeSlider.css'

interface RangeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  description?: string
}

export const RangeSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  description
}: RangeSliderProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label}
        <span className={styles.value}>({value.toFixed(2)})</span>
      </label>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className={styles.slider}
      />
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  )
}
