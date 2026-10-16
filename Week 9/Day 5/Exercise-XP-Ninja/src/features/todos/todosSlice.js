
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    { id: "1", text: "Learn Redux Toolkit", completed: true },
    { id: "2", text: "Practice selectors", completed: false },
    { id: "3", text: "Build a Todo List", completed: false },
  ],
  visibilityFilter: "All",
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(text) {
        return {
          payload: { id: nanoid(), text, completed: false },
        };
      },
    },
    toggleTodo(state, action) {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setVisibilityFilter(state, action) {
      state.visibilityFilter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  setVisibilityFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
