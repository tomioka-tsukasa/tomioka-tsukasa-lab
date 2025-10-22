'use client'

import { ReactNode } from 'react'
import * as styles from './Panel.css'

interface PanelProps {
  title: string
  children: ReactNode
  className?: string
}

export const Panel = ({
  title,
  children,
  className = ''
}: PanelProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
