import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	todosByUser: {},
};

const todosSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		addTodo(state, action) {
			const { userId, text } = action.payload;
			const userTodos = (state.todosByUser[userId] ||= []);
			const nextId = userTodos.reduce(
				(largestId, todo) => Math.max(largestId, todo.id),
				0,
			) + 1;

			userTodos.push({
				id: nextId,
				text,
				completed: false,
			});
		},
		toggleTodo(state, action) {
			const { userId, todoId } = action.payload;
			const todo = state.todosByUser[userId]?.find((item) => item.id === todoId);

			if (todo) {
				todo.completed = !todo.completed;
			}
		},
		removeTodo(state, action) {
			const { userId, todoId } = action.payload;
			const userTodos = state.todosByUser[userId];

			if (userTodos) {
				state.todosByUser[userId] = userTodos.filter(
					(todo) => todo.id !== todoId,
				);
			}
		},
	},
});

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;
