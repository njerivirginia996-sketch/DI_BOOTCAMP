
import { createSelector } from "@reduxjs/toolkit";

export const selectProducts = (state) => state.shop.products;
export const selectCart = (state) => state.shop.cart;

export const selectCartItems = createSelector(
  [selectProducts, selectCart],
  (products, cart) =>
    cart.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    })
);

export const calculateTotalPrice = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.reduce((total, item) => total + item.subtotal, 0)
);
