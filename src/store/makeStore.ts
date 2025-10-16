import { configureStore } from '@reduxjs/toolkit'
import loadingStore from './slice/loadingStore/loadingStore'

export const makeStore = () => {

  return configureStore({
    reducer: {
      loadingStore,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
