import { SliderChanger } from './components/SliderChanger/SliderChanger'
import { SliderProgressBar } from './components/SliderProgressBar/SliderProgressBar'
import { Title } from './components/Title/Title'
import * as styles from './page.css'

const HomePage = () => {
  return <>
    <div className={styles.root}>
      <div className={styles.title}>
        <Title number='01' titleEn='Production system' title='ボカロやCover動画のMVイラストを描きます。' />
      </div>
      <div className={styles.sliderChanger}>
        <SliderChanger current={1} total={3} />
      </div>
      <div className={styles.sliderProgressBar}>
        <SliderProgressBar bars={[
          { active: true },
          { active: false },
          { active: false },
        ]} />
      </div>
    </div>
  </>
}

export default HomePage
