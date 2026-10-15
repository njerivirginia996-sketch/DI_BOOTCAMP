import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "../redux/inventorySlice";

function UpdateQuantity() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.inventory.products);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (productId === "" || quantity === "" || Number(quantity) < 0) {
      return;
    }

    dispatch(
      updateQuantity({
        id: productId,
        quantity: Number(quantity),
      })
    );

    setProductId("");
    setQuantity("");
  }

  return (
    <section className="panel">
      <h2>Update Quantity</h2>

      {products.length === 0 ? (
        <p>Add a product before updating quantities.</p>
      ) : (
        <form className="product-form" onSubmit={handleSubmit}>
          <label htmlFor="update-product">Select product</label>
          <select
            id="update-product"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            required
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <label htmlFor="new-quantity">New quantity</label>
          <input
            id="new-quantity"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />

          <button type="submit">Update Quantity</button>
        </form>
      )}
    </section>
  );
}

export default UpdateQuantity;