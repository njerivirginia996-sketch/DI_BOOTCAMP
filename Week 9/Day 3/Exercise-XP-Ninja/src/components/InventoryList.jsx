import { useSelector } from "react-redux";
import RemoveProduct from "./RemoveProduct";

function InventoryList() {
  const products = useSelector((state) => state.inventory.products);

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );

  return (
    <section className="panel">
      <div className="inventory-heading">
        <div>
          <h2>Current Inventory</h2>
          <p>{products.length} products · {totalUnits} total units</p>
        </div>

        <div className="inventory-value">
          <span>Total value</span>
          <strong>${inventoryValue.toFixed(2)}</strong>
        </div>
      </div>

      {products.length === 0 ? (
        <p>Your inventory is empty. Add your first product.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    ${(product.quantity * product.price).toFixed(2)}
                  </td>
                  <td>
                    <RemoveProduct productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default InventoryList;