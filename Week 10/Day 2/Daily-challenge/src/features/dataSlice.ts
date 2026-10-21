import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { DataState } from '../types/types'

const initialState: DataState = {
  data: null,
  status: 'idle',
  error: null,
  activeRequestId: null,
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    requestStarted(state, action: PayloadAction<string>) {
      state.status = 'loading'
      state.error = null
      state.activeRequestId = action.payload
    },
    requestSucceeded(state, action: PayloadAction<{ requestId: string; data: unknown }>) {
      if (state.activeRequestId !== action.payload.requestId) return
      state.data = action.payload.data
      state.status = 'succeeded'
      state.activeRequestId = null
    },
    requestFailed(state, action: PayloadAction<{ requestId: string; error: string }>) {
      if (state.activeRequestId !== action.payload.requestId) return
      state.error = action.payload.error
      state.status = 'failed'
      state.activeRequestId = null
    },
    clearData(state) {
      state.data = null
      state.status = 'idle'
      state.error = null
      state.activeRequestId = null
    },
  },
})

export const { requestStarted, requestSucceeded, requestFailed, clearData } = dataSlice.actions
export default dataSlice.reducer