import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO } from "./actions";

const initialState = {
  categories: [
    { id: "personal", name: "Personal", todos: [] },
    { id: "study", name: "Study", todos: [] },
    { id: "work", name: "Work", todos: [] },
  ],
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO: {
      const { categoryId, todo } = action.payload;

      if (!todo.text || !state.categories.some((c) => c.id === categoryId)) {
        return state;
      }

      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === categoryId
            ? { ...category, todos: [...category.todos, todo] }
            : category
        ),
      };
    }

    case TOGGLE_TODO: {
      const { categoryId, todoId } = action.payload;

      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                todos: category.todos.map((todo) =>
                  todo.id === todoId
                    ? { ...todo, completed: !todo.completed }
                    : todo
                ),
              }
            : category
        ),
      };
    }

    case REMOVE_TODO: {
      const { categoryId, todoId } = action.payload;

      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                todos: category.todos.filter((todo) => todo.id !== todoId),
              }
            : category
        ),
      };
    }

    default:
      return state;
  }
};

export default todoReducer;
