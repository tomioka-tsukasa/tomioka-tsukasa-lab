import * as styles from './ArrowButton.css'

interface ArrowButtonProps {
  direction: 'top' | 'bottom',
  active: boolean,
  onClick?: () => void
}

export const ArrowButton = ({
  direction,
  active,
  onClick
}: ArrowButtonProps) => {
  return (
    <button
      className={`${styles.root} ${styles.variants[direction]} ${!active ? styles.unactive : ''}`}
      onClick={active ? onClick : undefined}
      disabled={!active}
    >
      <div className={styles.arrowLine} />
      <div className={styles.arrowLine} />
    </button>
  )
}
