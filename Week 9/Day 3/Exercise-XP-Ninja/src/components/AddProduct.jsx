import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/inventorySlice";

function AddProduct() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !name.trim() ||
      quantity === "" ||
      price === "" ||
      Number(quantity) < 0 ||
      Number(price) < 0 ||
      !Number.isFinite(Number(quantity)) ||
      !Number.isFinite(Number(price))
    ) {
      return;
    }

    dispatch(addProduct({ name, quantity, price }));

    setName("");
    setQuantity("");
    setPrice("");
  }

  return (
    <section className="panel">
      <h2>Add a Product</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        <label htmlFor="product-name">Product name</label>
        <input
          id="product-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Headphones"
          required
        />

        <label htmlFor="product-quantity">Quantity</label>
        <input
          id="product-quantity"
          type="number"
          min="0"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
        />

        <label htmlFor="product-price">Price ($)</label>
        <input
          id="product-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <button type="submit">Add Product</button>
      </form>
    </section>
  );
}

export default AddProduct;