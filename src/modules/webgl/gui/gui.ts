import * as dat from 'dat.gui'
import { GUITemplate, GUISettings } from './guiTypes'
import { getGUIInstance } from './modules/getGUIInstance/getGUIInstance'

// GUIインスタンスを保持する
let guiInstance: dat.GUI | null = null

/**
 * GUIを設定する
 */
export function setGUI(
  name: string,
  template: { [key: string]: GUITemplate },
  settings: GUISettings,
): {
  gui: dat.GUI,
  controllers: dat.GUIController[]
} {
  const gui = getGUIInstance()
  const folder = gui.addFolder(name)

  Object.entries(template).forEach(([prop, control]) => {
    switch (control.type) {
      case 'number':
        folder
          .add(settings, prop, control.min, control.max, control.step)
          .name(control.label)
        break
      case 'boolean':
        folder
          .add(settings, prop)
          .name(control.label)
        break
      case 'color':
        folder
          .addColor(settings, prop)
          .name(control.label)
        break
      case 'select':
        if (control.options) {
          folder
            .add(settings, prop, control.options)
            .name(control.label)
        }
        break
    }
  })

  folder.close()

  return {
    gui: folder,
    controllers: folder.__controllers,
  }
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
