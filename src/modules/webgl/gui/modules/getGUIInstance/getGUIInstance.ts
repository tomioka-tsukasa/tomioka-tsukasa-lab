import * as dat from 'dat.gui'
import { setupMember } from '../../../setupMember'

// GUIインスタンスを保持する
let guiInstance: dat.GUI | null = null

/**
 * GUIインスタンスを取得または作成する
 */
export const getGUIInstance = (): dat.GUI => {
  if (!guiInstance) {
    guiInstance = new dat.GUI()
    // デフォルト設定
    guiInstance.width = 300
    guiInstance.close()
    // スタイルの設定
    const style = document.createElement('style')
    style.innerHTML = `
      .dg.main {
        position: fixed;
        top: 0;
        right: 8px;
        z-index: 1000;
        font-family: 'Roboto', sans-serif;
        display: ${setupMember.gui.active ? 'block' : 'none'};
      }
      .dg.main .close-button {
        position: relative;
        line-height: 27px;
        height: 27px;
      }
      .dg.main .close-button.close-bottom {
        position: relative;
      }
      .dg.main .property-name {
        font-weight: 500;
      }
      .dg.main .c {
        width: 60%;
      }
      .dg.main .slider {
        margin-left: 0;
      }
    `
    document.head.appendChild(style)
  } else {
    // GUIの表示/非表示を更新
    const guiElement = document.querySelector('.dg.main') as HTMLElement
    if (guiElement) {
      guiElement.style.display = setupMember.gui.active ? 'block' : 'none'
    }
  }

  return guiInstance
}

/**
 * GUIインスタンスを破棄する
 */
export function destroyGUI(): void {
  if (guiInstance) {
    guiInstance.destroy()
    guiInstance = null
  }
}
