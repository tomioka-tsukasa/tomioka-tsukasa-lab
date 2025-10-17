import * as styles from './page.css'
import Link from 'next/link'

const HomePage = () => {
  return <>
    <div className={styles.root}>
      <section className={styles.section}>
        <h1 className={styles.heading}>
          Page List
        </h1>
        <ul>
          <li>
            <Link href='/effect/glitch'>Glitch</Link>
          </li>
        </ul>
      </section>
      <section className={styles.section}>
        <h1 className={styles.heading}>
          Tools
        </h1>
        <ul>
          <li>
            <Link target='_blank' href='http://editor.thebookofshaders.com/'>GLSL Editor</Link>
          </li>
          <li>
            <Link target='_blank' href='https://fordhurley.com/glsl-grapher/'>GLSL Grapher</Link>
          </li>
          <li>
            <Link target='_blank' href='https://academo.org/demos/3d-vector-plotter/'>3D Vector Plotter</Link>
          </li>
          <li>
            <Link target='_blank' href='https://graphtoy.com/'>Graphtoy</Link>
          </li>
        </ul>
      </section>
      <section className={styles.section}>
        <h1 className={styles.heading}>
          Learning
        </h1>
        <ul>
          <li>
            <Link target='_blank' href='https://thebookofshaders.com/glossary/'>The Book of Shaders</Link>
          </li>
        </ul>
      </section>
    </div>
  </>
}

export default HomePage
