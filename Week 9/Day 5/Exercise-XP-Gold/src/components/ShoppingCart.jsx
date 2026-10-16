
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/shop/shopSlice";
import {
  selectProducts,
  selectCartItems,
  calculateTotalPrice,
} from "../features/shop/shopSelectors";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(calculateTotalPrice);

  const handleAddToCart = useCallback(
    (productId) => {
      dispatch(addToCart(productId));
    },
    [dispatch]
  );

  return (
    <main className="container">
      <h1>Shopping Cart</h1>

      <section>
        <h2>Available Products</h2>
        <div className="products">
          {products.map((product) => (
            <article className="card" key={product.id}>
              <h3>{product.name}</h3>
              <p>{formatPrice(product.price)}</p>
              <button onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="cart">
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty. Add a product to get started.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity}
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>
        )}

        <h3>Total: {formatPrice(totalPrice)}</h3>
      </section>
    </main>
  );
}
