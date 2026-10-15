import { useDispatch, useSelector } from "react-redux";
import { removeProduct } from "../redux/inventorySlice";

function RemoveProduct({ productId }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.inventory.products);

  const productExists = products.some(
    (product) => product.id === productId
  );

  if (!productExists) {
    return null;
  }

  return (
    <button
      className="remove-button"
      type="button"
      onClick={() => dispatch(removeProduct(productId))}
    >
      Remove
    </button>
  );
}

export default RemoveProduct;