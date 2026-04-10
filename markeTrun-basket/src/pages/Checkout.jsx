
import React, { useState, useEffect } from "react";

// ✅ YOUR ORDER API
const ORDER_API = "https://sheetdb.io/api/v1/lsiil5o8chh5a";

function Checkout({ cart, setCart, goToHome }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ✅ Success popup
  const [successMessage, setSuccessMessage] = useState("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Service fee
  const serviceFee = Math.max(500, total * 0.1);

  // ✅ Final total
  const finalTotal = total + serviceFee;

  // ✅ Load cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, [setCart]);

  // ✅ Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ SEND ORDER TO SHEET
  const sendOrderToSheet = async () => {
    const orderId = Date.now();
    const date = new Date().toLocaleString();

    // ✅ OPTION A FORMAT (each item on new line)
    let summary = "";
    cart.forEach((item, i) => {
      summary += `${i + 1}. ${item.name} x${item.quantity} - ₦${item.price}\n`;
    });

    const orderData = {
      order_id: orderId,
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      order_summary: summary,
      total: total,
      service_fee: serviceFee,
      final_total: finalTotal,
      date: date
    };

    try {
      const res = await fetch(ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: orderData })
      });

      const data = await res.json();
      console.log("✅ Order saved:", data);
    } catch (error) {
      console.error("❌ Error sending order:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    // ✅ Send order
    await sendOrderToSheet();

    // ✅ Success popup
    setSuccessMessage(`Thank you, ${name}! Your order of ₦${finalTotal} has been received.`);

    // ✅ Clear cart
    setTimeout(() => {
      setCart([]);
      localStorage.removeItem("cart");
      goToHome();
      setSuccessMessage("");
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

      {/* ✅ Success Popup */}
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

      {/* ✅ Animation */}
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
