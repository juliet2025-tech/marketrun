import React, { useState, useEffect } from "react";

function Checkout({ cart, setCart, goToHome }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ✅ State for professional success popup
  const [successMessage, setSuccessMessage] = useState("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Service fee = 10% OR ₦500 (whichever is higher)
  const serviceFee = Math.max(500, total * 0.1);

  // ✅ Final total including service fee
  const finalTotal = total + serviceFee;

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, [setCart]);

  // ✅ Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    // Show professional success popup
    setSuccessMessage(`Thank you, ${name}! Your order of ₦${finalTotal} has been received.`);

    // Clear cart and go home after 2.5s
    setTimeout(() => {
      setCart([]);
      localStorage.removeItem("cart"); // ✅ clear from localStorage
      goToHome();
      setSuccessMessage(""); // hide popup
    }, 2500);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your basket is empty</p>
      ) : (
        <div>
          <h3>Order Summary</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} x {item.quantity} = ₦{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <h3>Total: ₦{total}</h3>
          <p>Service Fee: ₦{serviceFee}</p>
          <h3>Final Total: ₦{finalTotal}</h3>

          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              maxWidth: "400px"
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem",
                background: "#ff6600",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Place Order
            </button>
          </form>
        </div>
      )}

      {/* ✅ Professional success popup */}
      {successMessage && (
        <div
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            background: "#4caf50",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "10px",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
            fontWeight: "bold",
            zIndex: 9999,
            animation: "fadeInOut 2.5s ease-in-out"
          }}
        >
          ✅ {successMessage}
        </div>
      )}

      {/* ✅ Simple fade in/out animation for popup */}
      <style>
        {`
          @keyframes fadeInOut {
            0% {opacity: 0; transform: translateY(-10px);}
            10% {opacity: 1; transform: translateY(0);}
            90% {opacity: 1; transform: translateY(0);}
            100% {opacity: 0; transform: translateY(-10px);}
          }
        `}
      </style>
    </div>
  );
}

export default Checkout;