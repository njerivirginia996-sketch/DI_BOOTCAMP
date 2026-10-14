import { configureStore } from '@reduxjs/toolkit'
import plannerReducer, { createInitialState } from './plannerSlice.js'

const STORAGE_KEY = 'daybook-day3-planner'

function loadState() {
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) ?? 'null')
    const tasksByDay = saved?.tasksByDay
    if (
      tasksByDay &&
      typeof tasksByDay === 'object' &&
      !Array.isArray(tasksByDay) &&
      Object.values(tasksByDay).every(Array.isArray)
    ) {
      return {
        ...createInitialState(),
        ...saved,
        selectedDay: typeof saved.selectedDay === 'string' ? saved.selectedDay : createInitialState().selectedDay,
      }
    }
  } catch {
    try {
      globalThis.localStorage?.removeItem(STORAGE_KEY)
    } catch {
      return createInitialState()
    }
  }

  return createInitialState()
}

const store = configureStore({
  reducer: plannerReducer,
  preloadedState: loadState(),
})

store.subscribe(() => {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(store.getState()))
  } catch {
    return
  }
})

export default store