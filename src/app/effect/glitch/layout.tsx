import * as canvasStyles from '@/components/Canvas/Canvas.css'
import Canvas from './components/Canvas/CanvasWrapper'
import { Testor } from './components/Testor/Testor'
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen'
import * as styles from './layout.css'

export default function GlitchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>
    <LoadingScreen />
    <div className={canvasStyles.canvasContainer}>
      <div className={canvasStyles.canvasInner}>
        <div className={canvasStyles.canvas}>
          <Canvas />
        </div>
      </div>
    </div>
    <div className={styles.testor}>
      <Testor />
    </div>
    <div className={styles.page}>
      {children}
    </div>
  </>
}
