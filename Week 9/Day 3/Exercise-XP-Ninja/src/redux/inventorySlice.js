import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  products: [
    { id: "1", name: "Laptop", quantity: 5, price: 750 },
    { id: "2", name: "Keyboard", quantity: 12, price: 35 },
    { id: "3", name: "Mouse", quantity: 20, price: 15 },
  ],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addProduct: {
      reducer: (state, action) => {
        state.products.push(action.payload);
      },
      prepare: ({ name, quantity, price }) => ({
        payload: {
          id: nanoid(),
          name: name.trim(),
          quantity: Number(quantity),
          price: Number(price),
        },
      }),
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((item) => item.id === id);

      if (product) {
        product.quantity = Number(quantity);
      }
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
});

export const { addProduct, updateQuantity, removeProduct } =
  inventorySlice.actions;

export default inventorySlice.reducer;