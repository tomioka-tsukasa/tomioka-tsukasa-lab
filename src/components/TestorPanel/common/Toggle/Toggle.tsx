'use client'

import * as styles from './Toggle.css'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export const Toggle = ({
  label,
  checked,
  onChange,
  className = ''
}: ToggleProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label}>
        <div style={{ position: 'relative' }}>
          <input
            type='checkbox'
            checked={checked}
            onChange={handleChange}
            className={styles.hiddenInput}
          />
          <div
            className={`${styles.track} ${checked ? styles.trackActive : styles.trackInactive}`}
          />
          <div
            className={`${styles.dot} ${checked ? styles.dotActive : ''}`}
          />
        </div>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  )
}
