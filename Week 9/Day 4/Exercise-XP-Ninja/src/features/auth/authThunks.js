import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    if (!name.trim() || !email.includes("@") || password.length < 4) {
      return rejectWithValue(
        "Enter your name, a valid email, and a password of at least 4 characters."
      );
    }

    return {
      name: name.trim(),
      email: email.trim(),
    };
  }
);