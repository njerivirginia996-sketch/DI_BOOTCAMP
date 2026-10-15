export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const REMOVE_TODO = "REMOVE_TODO";

export const addTodo = (categoryId, text) => ({
  type: ADD_TODO,
  payload: {
    categoryId,
    todo: {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: text.trim(),
      completed: false,
    },
  },
});

export const toggleTodo = (categoryId, todoId) => ({
  type: TOGGLE_TODO,
  payload: { categoryId, todoId },
});

export const removeTodo = (categoryId, todoId) => ({
  type: REMOVE_TODO,
  payload: { categoryId, todoId },
});
