// App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Announcement from "./components/Announcement";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import "./styles/global.css";
import { fetchProducts, addOrder } from "./api/sheetdb";

function App() {
  // ✅ Cart state
  const [cart, setCart] = useState([]);

  // ✅ Toast
  const [toastMessage, setToastMessage] = useState("");

  // ✅ LocalStorage control
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Custom order state
  const [customOrder, setCustomOrder] = useState({
    name: "",
    quantity: 1,
    price: 0,
    notes: "",
    image: ""
  });

  // ✅ Navigation
  const [currentPage, setCurrentPage] = useState("home");

  // ✅ Products from SheetDB
  const [products, setProducts] = useState([]);

  // ✅ Load products from SheetDB
  useEffect(() => {
    const loadProducts = async () => {
      const sheetProducts = await fetchProducts();
      const formatted = sheetProducts.map(p => ({
        id: Number(p.id),
        name: p.name,
        price: Number(p.price),
        image: p.image || "/placeholder.png"
      }));
      setProducts(formatted);
    };
    loadProducts();
  }, []);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
    setIsLoaded(true);
  }, []);

  // ✅ Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // ✅ Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // ✅ Add to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setToastMessage(`${product.name} added to basket`);
  };

  // ✅ Custom order submit
  const handleCustomOrderSubmit = async (e) => {
    e.preventDefault();
    if (!customOrder.name) return;

    const newItem = {
      id: Date.now(),
      name: customOrder.name,
      quantity: customOrder.quantity,
      notes: customOrder.notes,
      price: customOrder.price,
      image: customOrder.image || "/placeholder.png"
    };

    setCart([...cart, newItem]);
    setToastMessage(`${customOrder.name} added to basket`);

    // ✅ Send custom order directly to SheetDB
    await addOrder({
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
      notes: newItem.notes,
      image: newItem.image
    });

    closeModal();
  };

  // ✅ Navigation handlers
  const goToHome = () => setCurrentPage("home");
  const goToBasket = () => setCurrentPage("basket");
  const goToCheckout = () => setCurrentPage("checkout");

  // ✅ Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCustomOrder({ name: "", quantity: 1, price: 0, notes: "", image: "" });
  };

  return (
    <div className="app">
      <Header
        goToHome={goToHome}
        goToBasket={goToBasket}
        goToCheckout={goToCheckout}
        cartCount={cart.length}
      />

      <Announcement />

      {/* ✅ Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "5rem",
            right: "1rem",
            background: "#4caf50",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            zIndex: 9999
          }}
        >
          ✅ {toastMessage}
        </div>
      )}

      {/* ✅ Pages */}
      <main>
        {currentPage === "home" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>

            <div style={{ textAlign: "center", margin: "2rem 0" }}>
              <button className="custom-order-btn" onClick={openModal}>
                Add Custom Order
              </button>
            </div>
          </>
        )}

        {currentPage === "basket" && (
          <Basket
            cart={cart}
            setCart={setCart}
            goToCheckout={goToCheckout}
            setToastMessage={setToastMessage}
          />
        )}

        {currentPage === "checkout" && (
          <Checkout
            cart={cart}
            setCart={setCart}
            goToHome={goToHome}
          />
        )}
      </main>

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Custom Order</h2>
            <form onSubmit={handleCustomOrderSubmit}>
              <input
                type="text"
                placeholder="Item name"
                value={customOrder.name}
                onChange={(e) => setCustomOrder({ ...customOrder, name: e.target.value })}
                required
              />

              <input
                type="number"
                min="1"
                value={customOrder.quantity}
                onChange={(e) => setCustomOrder({ ...customOrder, quantity: e.target.value })}
                onBlur={() => {
                  let num = parseInt(customOrder.quantity, 10);
                  if (isNaN(num) || num < 1) num = 1;
                  setCustomOrder({ ...customOrder, quantity: num });
                }}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              />

              <label>
                Price (₦):
                <input
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={customOrder.price}
                  onChange={(e) => setCustomOrder({ ...customOrder, price: Number(e.target.value) })}
                  required
                />
              </label>

              {customOrder.image && (
                <img
                  src={customOrder.image || "/placeholder.png"}
                  alt="preview"
                  style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
              )}

              <textarea
                placeholder="Additional notes"
                value={customOrder.notes}
                onChange={(e) => setCustomOrder({ ...customOrder, notes: e.target.value })}
              />

              <div className="modal-buttons">
                <button type="submit">Add to Basket</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;