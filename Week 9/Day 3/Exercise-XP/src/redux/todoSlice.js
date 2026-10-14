import { createSlice } from '@reduxjs/toolkit'

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      })
    },
    toggleTodo: (state, action) => {
      const todo = state.find((item) => item.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
    removeTodo: (state, action) => state.filter((todo) => todo.id !== action.payload),
  },
})

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions
export default todoSlice.reducer