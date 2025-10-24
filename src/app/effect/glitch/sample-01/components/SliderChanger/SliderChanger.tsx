import { ArrowButton } from '../ArrowButton/ArrowButton'
import * as styles from './SliderChanger.css'

interface SliderChangerProps {
  current: number,
  total: number,
}

export const SliderChanger = ({
  current,
  total,
}: SliderChangerProps) => {
  return (
    <div className={styles.root}>
      <ArrowButton direction='top' active={true} />
      <div className={styles.progressNumber}>
        {`${current.toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`}
      </div>
      <ArrowButton direction='bottom' active={true} />
    </div>
  )
}
