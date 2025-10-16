import * as canvasStyles from '@/components/Canvas/Canvas.css'
import Canvas from './components/Canvas/CanvasWrapper'
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen'

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
    <div>
      {children}
    </div>
  </>
}
