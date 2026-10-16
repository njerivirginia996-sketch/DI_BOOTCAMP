
import { createSelector } from "@reduxjs/toolkit";

const selectAllTasks = (state) => state.productivity.tasks;
const selectAllCategories = (state) => state.productivity.categories;

export const selectTasksByCategory = createSelector(
  [
    selectAllTasks,
    (_state, categoryId) => categoryId,
  ],
  (tasks, categoryId) => {
    if (!categoryId || categoryId === "all") return tasks;

    return tasks.filter((task) => task.categoryId === categoryId);
  }
);

export const selectCompletedTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task) => task.completed).length
);

export const selectCategoryById = createSelector(
  [
    selectAllCategories,
    (_state, categoryId) => categoryId,
  ],
  (categories, categoryId) =>
    categories.find((category) => category.id === categoryId)
);

export const selectCategories = selectAllCategories;
export const selectAllTaskCount = createSelector(
  [selectAllTasks],
  (tasks) => tasks.length
);
