import * as styles from './SliderProgressBar.css'

interface SliderProgressBarProps {
  bars?: {
    active: boolean
  }[]
}

export const SliderProgressBar = ({
  bars = [
    { active: true },
    { active: false },
    { active: false }
  ]
}: SliderProgressBarProps) => {
  return (
    <div className={styles.root}>
      {bars.map((bar, index) => (
        <div
          key={index}
          className={`${styles.bar} ${bar.active ? styles.barActive : styles.barInactive}`}
        />
      ))}
    </div>
  )
}
