import AddProduct from "./components/AddProduct";
import InventoryList from "./components/InventoryList";
import UpdateQuantity from "./components/UpdateQuantity";
import "./index.css";

function App() {
  return (
    <main className="app-container">
      <header className="app-header">
        <p className="eyebrow">REACT · REDUX TOOLKIT</p>
        <h1>Store Inventory</h1>
        <p>Manage your products, stock quantities and inventory value.</p>
      </header>

      <div className="forms-grid">
        <AddProduct />
        <UpdateQuantity />
      </div>

      <InventoryList />

      <footer>Store Inventory Management · Powered by Redux Toolkit</footer>
    </main>
  );
}

export default App;