import { createStore } from 'redux'
import plannerReducer, { createInitialState } from './reducer.js'

const STORAGE_KEY = 'daybook-planner-state'

function loadState() {
  try {
    const savedState = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) ?? 'null')
    const tasksByDay = savedState?.tasksByDay
    if (
      tasksByDay &&
      typeof tasksByDay === 'object' &&
      !Array.isArray(tasksByDay) &&
      Object.values(tasksByDay).every(Array.isArray)
    ) {
      return {
        ...createInitialState(),
        ...savedState,
        selectedDay: savedState.selectedDay || createInitialState().selectedDay,
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

const store = createStore(plannerReducer, loadState())

store.subscribe(() => {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(store.getState()))
  } catch {
    return
  }
})

export default store