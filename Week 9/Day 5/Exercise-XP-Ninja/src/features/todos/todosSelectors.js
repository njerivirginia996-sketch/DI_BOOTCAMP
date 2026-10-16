
import { createSelector } from "@reduxjs/toolkit";

const selectAllTodos = (state) => state.todos.items;

export const selectVisibilityFilter = (state) =>
  state.todos.visibilityFilter;

export const selectTodos = createSelector(
  [selectAllTodos, selectVisibilityFilter],
  (todos, filter) => {
    if (filter === "Active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "Completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }
);

export const selectFilteredTodosCount = createSelector(
  [selectTodos],
  (todos) => todos.length
);
