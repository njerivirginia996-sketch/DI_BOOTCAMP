import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "./features/products/productThunks";
import ProductListing from "./components/ProductListing";
import ShoppingCart from "./components/ShoppingCart";
import AuthForm from "./components/AuthForm";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="site-header">
        <div>
          <p className="eyebrow">YOUR ONLINE STORE</p>
          <h1>ShopEase</h1>
        </div>

        <p>Discover something you love.</p>
      </header>

      <main>
        <AuthForm />

        <div className="store-layout">
          <ProductListing />
          <ShoppingCart />
        </div>
      </main>

      <footer>
        <p>ShopEase — React and Redux Toolkit practice project.</p>
      </footer>
    </div>
  );
}

export default App;