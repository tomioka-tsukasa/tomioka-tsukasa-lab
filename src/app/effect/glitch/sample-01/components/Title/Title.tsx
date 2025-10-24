import * as styles from './Title.css'

interface TitleProps {
  number: string
  titleEn: string
  title: string
}

export const Title = ({
  number,
  titleEn,
  title,
}: TitleProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.number}>
        {number}
      </div>
      <p className={styles.titleEn}>
        {titleEn}
      </p>
      <h1 className={styles.title}>
        {title}
      </h1>
    </div>
  )
}
