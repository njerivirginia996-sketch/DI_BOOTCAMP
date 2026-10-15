import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products?limit=12");

      if (!response.ok) {
        throw new Error("Unable to fetch products.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong.");
    }
  }
);