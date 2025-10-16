import * as styles from './UiImage.css'
import Image, { ImageProps } from 'next/image'

export const UiImage = ({
  src,
  alt,
  ...props
}: ImageProps) => {
  return <Image
    src={src}
    alt={alt}
    className={styles.image}
    {...props}
  />
}
