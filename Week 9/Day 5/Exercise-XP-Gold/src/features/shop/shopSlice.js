
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [
    { id: 1, name: "Laptop", price: 75000 },
    { id: 2, name: "Headphones", price: 3500 },
    { id: 3, name: "Keyboard", price: 2500 },
    { id: 4, name: "Mouse", price: 1200 },
    { id: 5, name: "Monitor", price: 18000 },
  ],
  cart: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productId = action.payload;
      const existingItem = state.cart.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ productId, quantity: 1 });
      }
    },
  },
});

export const { addToCart } = shopSlice.actions;
export default shopSlice.reducer;
