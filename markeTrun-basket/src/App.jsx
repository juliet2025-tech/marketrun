import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Announcement from "./components/Announcement";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import "./styles/global.css";
import { fetchProducts, } from "./api/sheetdb";


function App() {
  // ================= CART STATE =================
  const [cart, setCart] = useState([]);

  // ================= TOAST =================
  const [toastMessage, setToastMessage] = useState("");

  // ================= MODAL =================
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================= CUSTOM ORDER =================
  const [customOrder, setCustomOrder] = useState({
    name: "",
    quantity: 1,
    price: 0,
    notes: "",
    image: ""
  });

  // ================= NAVIGATION =================
  const [currentPage, setCurrentPage] = useState("home");

  // ================= PRODUCTS =================
  const [products, setProducts] = useState([]);

  // ================= LOAD PRODUCTS =================
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

  // ================= LOAD CART (FIXED) =================
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // ================= SAVE CART =================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ================= TOAST AUTO HIDE =================
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // ================= ADD TO CART (FIXED) =================
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    let updatedCart;

    if (existing) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setToastMessage(`${product.name} added to basket`);
  };

  // ================= CUSTOM ORDER =================
  const handleCustomOrderSubmit = async (e) => {
    e.preventDefault();

    if (!customOrder.name) return;

    const newItem = {
      id: Date.now(),
      name: customOrder.name,
      quantity: Number(customOrder.quantity),
      notes: customOrder.notes,
      price: Number(customOrder.price),
      image: customOrder.image || "/placeholder.png"
    };

    const updatedCart = [...cart, newItem];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setToastMessage(`${customOrder.name} added to basket`);

    await addOrder({
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
      notes: newItem.notes,
      image: newItem.image
    });

    closeModal();
  };

  // ================= NAVIGATION =================
  const goToHome = () => setCurrentPage("home");
  const goToBasket = () => setCurrentPage("basket");
  const goToCheckout = () => setCurrentPage("checkout");
  

  // ================= MODAL =================
  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setCustomOrder({
      name: "",
      quantity: 1,
      price: 0,
      notes: "",
      image: ""
    });
  };

  // ================= RENDER =================
  return (
    <div className="app">

      <Header
        goToHome={goToHome}
        goToBasket={goToBasket}
        goToCheckout={goToCheckout}
        
        cartCount={cart.length}
      />

      <Announcement />

      {/* TOAST */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "5rem",
          right: "1rem",
          background: "#4caf50",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          zIndex: 9999
        }}>
          {toastMessage}
        </div>
      )}

      <main>

        {/* HOME */}
        {currentPage === "home" && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem"
            }}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>

            <div style={{ textAlign: "center", margin: "2rem 0" }}>
              <button onClick={openModal}>
                Add Custom Order
              </button>
            </div>
          </>
        )}

        {/* BASKET */}
        {currentPage === "basket" && (
          <Basket
            cart={cart}
            setCart={setCart}
            goToCheckout={goToCheckout}
            setToastMessage={setToastMessage}
          />
        )}

        {/* CHECKOUT */}
        {currentPage === "checkout" && (
          <Checkout
            cart={cart}
            setCart={setCart}
            goToHome={goToHome}
          />
        )}

        {/* ORDERS */}
        

      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">

            <h2>Custom Order</h2>

            <form onSubmit={handleCustomOrderSubmit}>

              <input
                placeholder="Item name"
                value={customOrder.name}
                onChange={(e) =>
                  setCustomOrder({ ...customOrder, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                min="1"
                value={customOrder.quantity}
                onChange={(e) =>
                  setCustomOrder({ ...customOrder, quantity: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                value={customOrder.price}
                onChange={(e) =>
                  setCustomOrder({ ...customOrder, price: e.target.value })
                }
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Add</button>
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