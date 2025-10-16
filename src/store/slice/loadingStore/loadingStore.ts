import { createSlice } from '@reduxjs/toolkit'
import { InitialState } from './loadingStoreTypes'

const initialState: InitialState = {
  loading: true,
  loadComplete: false,
}

const loadingStore = createSlice({
  name: 'loadingStore',
  initialState,
  reducers: {
    setLoaded(state) {
      state.loading = false
    },
    setLoadComplete(state) {
      state.loadComplete = true
    },
  }
})

export const { setLoaded, setLoadComplete } = loadingStore.actions
export default loadingStore.reducer
