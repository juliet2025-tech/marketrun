import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Announcement from "./components/Announcement";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import "./styles/global.css";

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
    quantity: 0 ,
     price: "",   // ✅ ADD THIS
    notes: ""
  });

  // ✅ Navigation
  const [currentPage, setCurrentPage] = useState("home");

  // ✅ Load cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart !== null) setCart(savedCart);
    setIsLoaded(true);
  }, []);

  // ✅ Save cart
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


<input 
  type="number"
  min="1"
  value={customOrder.quantity}
  
  onChange={(e) => {
    // Allow typing freely
    setCustomOrder({
      ...customOrder,
      quantity: e.target.value
    });
  }}

  onBlur={() => {
    // Clean AFTER user finishes typing
    let num = parseInt(customOrder.quantity, 10);

    if (isNaN(num) || num < 1) {
      num = 1;
    }

    setCustomOrder({
      ...customOrder,
      quantity: num
    });
  }}

  onKeyDown={(e) => {
    // Prevent weird inputs
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
/>





  // ✅ Products
  const products = [
    { id: 1, name: "Fresh Tomatoes", price: 500, image: "https://i.pinimg.com/1200x/2b/d1/fe/2bd1feb9a59da17ca25723f5eec26b80.jpg" },
    { id: 2, name: "Bananas", price: 300, image: "https://i.pinimg.com/1200x/70/d4/4f/70d44fe3fd0b0b2c3199f2c62ff17539.jpg" },
    { id: 3, name: "Yam Tubers", price: 800, image: "https://i.pinimg.com/1200x/18/ee/47/18ee47fba7377da36b976f185bcfaa23.jpg" },
    { id: 4, name: "Potatoes", price: 500, image: "https://i.pinimg.com/1200x/eb/65/a0/eb65a009f3bcf94ce83ee6e8c7261e6e.jpg" },
    { id: 5, name: "Plantain", price: 300, image: "https://i.pinimg.com/1200x/39/5e/e8/395ee829635032c1768a26568a0384b6.jpg" },
    { id: 6, name: "Bag of Rice", price: 800, image: "https://i.pinimg.com/1200x/48/fa/72/48fa72b2637f3f09c8904e1140bc5a84.jpg" },
    { id: 7, name: "Cucumber", price: 500, image: "https://i.pinimg.com/1200x/47/7a/46/477a4648c42c648a74524106dc608a20.jpg" },
  ];

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
  const handleCustomOrderSubmit = (e) => {
    e.preventDefault();

    if (!customOrder.name) return;

    const newItem = {
      id: Date.now(),
      name: customOrder.name,
      quantity: customOrder.quantity,
      notes: customOrder.notes,
      price: customOrder.price ,
      image: "/placeholder.png"
    };

    setCart([...cart, newItem]);
    setToastMessage(`${customOrder.name} added to basket`);

    closeModal();
  };

  // ✅ Navigation
  const goToHome = () => setCurrentPage("home");
  const goToBasket = () => setCurrentPage("basket");
  const goToCheckout = () => setCurrentPage("checkout");

  // ✅ Modal handlers
  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setCustomOrder({ name: "", quantity: 1, notes: "" });
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
            top: "5rem", // avoids header overlap
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
                onChange={(e) =>
                  setCustomOrder({ ...customOrder, name: e.target.value })
                }
                required
              />

             <input 
  type="number"
  min="1"
  value={customOrder.quantity}
  
  onChange={(e) => {
    // Allow typing freely
    setCustomOrder({
      ...customOrder,
      quantity: e.target.value
    });
  }}

  onBlur={() => {
    // Clean AFTER user finishes typing
    let num = parseInt(customOrder.quantity, 10);

    if (isNaN(num) || num < 1) {
      num = 1;
    }

    setCustomOrder({
      ...customOrder,
      quantity: num
    });
  }}

  onKeyDown={(e) => {
    // Prevent weird inputs
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
/>

 {/* ✅ NEW PRICE INPUT */}
  <label>
    Price (₦):
    <input 
      type="number"
      min="0"
      placeholder="Enter price"
      value={customOrder.price}
      onChange={(e) => setCustomOrder({...customOrder, price: Number(e.target.value)})}
      required
    />
  </label>


  

              {customOrder.image && (
               <img
  src={customOrder.image || "/placeholder.png"}
  alt="preview"
  style={{
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px"
  }}
  onError={(e) => { e.target.src = "/placeholder.png"; }}
/>
              )}











              <textarea
                placeholder="Additional notes"
                value={customOrder.notes}
                onChange={(e) =>
                  setCustomOrder({ ...customOrder, notes: e.target.value })
                }
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