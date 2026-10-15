import { createAsyncThunk } from "@reduxjs/toolkit";

export const ageUpAsync = createAsyncThunk(
  "age/ageUpAsync",
  async (_, { getState }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return getState().age.age + 1;
  }
);

export const ageDownAsync = createAsyncThunk(
  "age/ageDownAsync",
  async (_, { getState }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return Math.max(0, getState().age.age - 1);
  }
);