
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    { id: "work", name: "Work" },
    { id: "study", name: "Study" },
    { id: "personal", name: "Personal" },
  ],
  tasks: [
    {
      id: "task-1",
      title: "Complete Redux practice",
      categoryId: "study",
      completed: false,
    },
    {
      id: "task-2",
      title: "Plan the day",
      categoryId: "personal",
      completed: true,
    },
    {
      id: "task-3",
      title: "Review project tasks",
      categoryId: "work",
      completed: false,
    },
  ],
};

const productivitySlice = createSlice({
  name: "productivity",
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.tasks.push(action.payload);
      },
      prepare({ title, categoryId }) {
        return {
          payload: {
            id: nanoid(),
            title,
            categoryId,
            completed: false,
          },
        };
      },
    },

    editTask(state, action) {
      const { id, title, categoryId } = action.payload;
      const task = state.tasks.find((item) => item.id === id);

      if (task) {
        if (title !== undefined) task.title = title;
        if (categoryId !== undefined) task.categoryId = categoryId;
      }
    },

    deleteTask(state, action) {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
    },

    updateTaskProgress(state, action) {
      const task = state.tasks.find(
        (item) => item.id === action.payload
      );

      if (task) task.completed = !task.completed;
    },

    addCategory: {
      reducer(state, action) {
        state.categories.push(action.payload);
      },
      prepare(name) {
        return {
          payload: { id: nanoid(), name },
        };
      },
    },

    editCategory(state, action) {
      const { id, name } = action.payload;
      const category = state.categories.find((item) => item.id === id);

      if (category) category.name = name;
    },

    deleteCategory(state, action) {
      const id = action.payload;

      state.categories = state.categories.filter(
        (category) => category.id !== id
      );

      // Keep tasks valid by moving affected tasks to "Personal"
      // when that category exists, otherwise remove the category ID.
      const fallback = state.categories.find(
        (category) => category.id === "personal"
      );

      state.tasks.forEach((task) => {
        if (task.categoryId === id) {
          task.categoryId = fallback ? fallback.id : "";
        }
      });
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  updateTaskProgress,
  addCategory,
  editCategory,
  deleteCategory,
} = productivitySlice.actions;

export default productivitySlice.reducer;
