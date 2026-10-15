import { createSlice } from '@reduxjs/toolkit';
import { fetchTodos } from './todoThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,

  reducers: {
    addTodo: (state, action) => {
      state.items.unshift({
        id: `local-${Date.now()}`,
        title: action.payload,
        completed: false,
      });
    },

    toggleTodo: (state, action) => {
      const todo = state.items.find(
        (item) => item.id === action.payload
      );

      if (todo) {
        todo.completed = !todo.completed;
      }
    },

    removeTodo: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    setTodos: (state, action) => {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Something went wrong.';
      });
  },
});

export const { addTodo, toggleTodo, removeTodo, setTodos } =
  todoSlice.actions;

export default todoSlice.reducer;
