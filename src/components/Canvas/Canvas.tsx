'use client'

import { createWebGL } from '@/modules/webgl/webgl'
import { useEffect } from 'react'
import { destroyGUI } from '@/modules/webgl/gui/gui'
import { useAppDispatch } from '@/store/hook'
import { setLoadComplete } from '@/store/slice/loadingStore/loadingStore'
import { webglCtrl } from '@/modules/webgl/setupMember'
import * as styles from './Canvas.css'

/**
 * キャンバスコンポーネント
 * ・`./Canvas.tsx` でダイナミックインポートしている
 * ・マスクは CanvasMask コンポーネントが別途担当
 */
const Canvas = () => {
  const dispatch = useAppDispatch()

  /**
   * キャンバスの作成
   */
  useEffect(() => {
    if (webglCtrl.loadComplete) return

    createWebGL(
      () => {
        webglCtrl.loadComplete = true
        setTimeout(() => {
          dispatch(setLoadComplete())
        }, 700)
      },
    )

    return () => {
      // アンマウント時はGUIを破棄
      destroyGUI()
    }
  }, [dispatch])

  return <>
    <canvas id='canvas' className={styles.root} />
  </>
}

export default Canvas
