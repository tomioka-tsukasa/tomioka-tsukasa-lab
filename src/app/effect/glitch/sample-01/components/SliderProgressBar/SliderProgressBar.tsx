import * as styles from './SliderProgressBar.css'

interface SliderProgressBarProps {
  currentIndex: number
  totalCount: number
  onSlideChange?: (index: number) => void
}

export const SliderProgressBar = ({
  currentIndex,
  totalCount,
  onSlideChange
}: SliderProgressBarProps) => {
  return (
    <div className={styles.root}>
      {Array.from({ length: totalCount }, (_, index) => (
        <button
          key={index}
          className={`${styles.bar} ${index === currentIndex ? styles.barActive : styles.barInactive}`}
          onClick={() => onSlideChange?.(index)}
        />
      ))}
    </div>
  )
}
