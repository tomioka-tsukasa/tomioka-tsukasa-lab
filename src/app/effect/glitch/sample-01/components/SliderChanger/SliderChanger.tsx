import { ArrowButton } from '../ArrowButton/ArrowButton'
import * as styles from './SliderChanger.css'

interface SliderChangerProps {
  current: number,
  total: number,
  onPrev?: () => void,
  onNext?: () => void
}

export const SliderChanger = ({
  current,
  total,
  onPrev,
  onNext
}: SliderChangerProps) => {
  const hasPrev = current > 1
  const hasNext = current < total

  return (
    <div className={styles.root}>
      <ArrowButton
        direction='top'
        active={hasPrev}
        onClick={onPrev}
      />
      <div className={styles.progressNumber}>
        {`${current.toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`}
      </div>
      <ArrowButton
        direction='bottom'
        active={hasNext}
        onClick={onNext}
      />
    </div>
  )
}
