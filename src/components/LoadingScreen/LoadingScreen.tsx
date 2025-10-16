'use client'

import { useEffect, useState } from 'react'
import * as styles from './LoadingScreen.css'
import { useAppSelector } from '@/store/hook'

export const LoadingScreen = () => {
  const loadingStore = useAppSelector((selector) => selector.loadingStore)
  const [isShow, setIsShow] = useState(true)

  useEffect(() => {
    if (loadingStore.loadComplete) {
      setIsShow(false)
    }
  }, [loadingStore.loadComplete])

  return (
    <div className={`${styles.root} ${isShow ? '' : styles.fadeOut}`}>
      <div className={`${styles.text}`}>
        <p>Loading...</p>
      </div>
    </div>
  )
}
