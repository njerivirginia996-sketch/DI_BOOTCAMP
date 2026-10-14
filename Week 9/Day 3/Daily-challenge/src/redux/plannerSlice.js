import { createSlice } from '@reduxjs/toolkit'

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createInitialState = (selectedDay = localDateKey()) => ({
  selectedDay,
  tasksByDay: {},
})

const plannerSlice = createSlice({
  name: 'planner',
  initialState: createInitialState(),
  reducers: {
    selectDay: (state, action) => {
      state.selectedDay = action.payload
    },
    addTask: (state, action) => {
      const { day, task } = action.payload
      if (!day || !task?.title?.trim()) return
      state.tasksByDay[day] ??= []
      state.tasksByDay[day].push({ ...task, title: task.title.trim() })
    },
    editTask: (state, action) => {
      const { day, id, updates } = action.payload
      const task = state.tasksByDay[day]?.find((item) => item.id === id)
      if (task && updates?.title?.trim()) {
        task.title = updates.title.trim()
        task.time = updates.time
        task.notes = updates.notes?.trim() ?? ''
      }
    },
    deleteTask: (state, action) => {
      const { day, id } = action.payload
      state.tasksByDay[day] = (state.tasksByDay[day] ?? []).filter((task) => task.id !== id)
    },
    toggleTask: (state, action) => {
      const { day, id } = action.payload
      const task = state.tasksByDay[day]?.find((item) => item.id === id)
      if (task) task.completed = !task.completed
    },
  },
})

export const { selectDay, addTask, editTask, deleteTask, toggleTask } = plannerSlice.actions
export default plannerSlice.reducer