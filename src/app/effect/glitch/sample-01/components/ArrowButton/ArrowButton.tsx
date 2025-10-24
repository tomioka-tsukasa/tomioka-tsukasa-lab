import * as styles from './ArrowButton.css'

interface ArrowButtonProps {
  direction: 'top' | 'bottom',
  active: boolean,
}

export const ArrowButton = ({
  direction,
  active,
}: ArrowButtonProps) => {
  return (
    <button className={`${styles.root} ${styles.variants[direction]} ${!active ? styles.unactive : ''}`}>
      <div className={styles.arrowLine} />
      <div className={styles.arrowLine} />
    </button>
  )
}
