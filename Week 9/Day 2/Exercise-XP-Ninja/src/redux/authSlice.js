import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	users: [],
	currentUser: null,
	isAuthenticated: false,
	error: null,
	message: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		registerUser(state, action) {
			const { username, email, password } = action.payload;
			const normalizedEmail = email.trim().toLowerCase();

			if (state.users.some((user) => user.email === normalizedEmail)) {
				state.error = "An account with this email already exists.";
				state.message = null;
				return;
			}

			const user = {
				id: state.users.length + 1,
				username: username.trim(),
				email: normalizedEmail,
				password,
			};

			state.users.push(user);
			state.currentUser = {
				id: user.id,
				username: user.username,
				email: user.email,
			};
			state.isAuthenticated = true;
			state.error = null;
			state.message = "Account created successfully.";
		},
		loginUser(state, action) {
			const { email, password } = action.payload;
			const normalizedEmail = email.trim().toLowerCase();
			const user = state.users.find(
				(candidate) =>
					candidate.email === normalizedEmail && candidate.password === password,
			);

			if (!user) {
				state.error = "Invalid email or password.";
				state.message = null;
				return;
			}

			state.currentUser = {
				id: user.id,
				username: user.username,
				email: user.email,
			};
			state.isAuthenticated = true;
			state.error = null;
			state.message = `Welcome back, ${user.username}!`;
		},
		logoutUser(state) {
			state.currentUser = null;
			state.isAuthenticated = false;
			state.error = null;
			state.message = null;
		},
		clearAuthFeedback(state) {
			state.error = null;
			state.message = null;
		},
	},
});

export const { registerUser, loginUser, logoutUser, clearAuthFeedback } =
	authSlice.actions;
export default authSlice.reducer;
