
import { configureStore } from "@reduxjs/toolkit";
import productivityReducer from "../features/productivity/productivitySlice";

export const store = configureStore({
  reducer: {
    productivity: productivityReducer,
  },
});
