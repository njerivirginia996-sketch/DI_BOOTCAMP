import { createSlice } from "@reduxjs/toolkit";
import { ageUpAsync, ageDownAsync } from "./ageThunks";

const ageSlice = createSlice({
  name: "age",

  initialState: {
    age: 25,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(ageUpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ageUpAsync.fulfilled, (state, action) => {
        state.age = action.payload;
        state.loading = false;
      })
      .addCase(ageUpAsync.rejected, (state) => {
        state.loading = false;
        state.error = "Unable to update age.";
      })

      .addCase(ageDownAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ageDownAsync.fulfilled, (state, action) => {
        state.age = action.payload;
        state.loading = false;
      })
      .addCase(ageDownAsync.rejected, (state) => {
        state.loading = false;
        state.error = "Unable to update age.";
      });
  },
});

export default ageSlice.reducer;