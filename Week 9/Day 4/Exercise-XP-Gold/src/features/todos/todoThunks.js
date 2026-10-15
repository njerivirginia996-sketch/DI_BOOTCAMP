import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://dummyjson.com/todos?limit=10'
      );

      if (!response.ok) {
        return rejectWithValue('Failed to fetch todos.');
      }

      const data = await response.json();
      return data.todos.map(({ id, todo, completed }) => ({
        id,
        title: todo,
        completed,
      }));
    } catch {
      return rejectWithValue(
        'Unable to connect to the server. Check your internet connection.'
      );
    }
  }
);
