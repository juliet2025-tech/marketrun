import React, { useState, useEffect } from "react";

const ORDER_API = "https://sheetdb.io/api/v1/lsiil5o8chh5a";

function Checkout({ cart, setCart, goToHome }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [responseMsg, setResponseMsg] = useState(""); // ✅ NEW: response tracker

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const serviceFee = Math.max(500, total * 0.1);
  const finalTotal = total + serviceFee;

  // ================= LOAD CART =================
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, [setCart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ================= SEND ORDER =================
  const sendOrderToSheet = async (id) => {
    let summary = "";

    cart.forEach((item, i) => {
      summary += `${i + 1}. ${item.name} x${item.quantity} - ₦${item.price}\n`;
    });

    const orderData = {
      order_id: id,
      date: new Date().toLocaleString(),
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      order_summary: summary,
      total: total,
      service_fee: serviceFee,
      total_amount: finalTotal,
      payment_method: "Bank Transfer",
      payment_status: "Pending Payment",
      delivery_status: "Yet to Deliver"
    };

    console.log("🚀 SENDING ORDER DATA:", orderData);

    try {
      const res = await fetch(ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: orderData })
      });

      const result = await res.json();

      console.log("🔥 SHEETDB RESPONSE:", result);

      // ✅ SAVE RESPONSE FOR UI DISPLAY
      if (result.created === 1 || result.success) {
        setResponseMsg("Order saved successfully ✅");
      } else {
        setResponseMsg("Order sent but not confirmed ❗ Check SheetDB");
      }

      return result;
    } catch (error) {
      console.error("❌ SHEET ERROR:", error);
      setResponseMsg("Failed to send order ❌");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const newOrderId = `PFB-${Date.now()}`;

    await sendOrderToSheet(newOrderId);

    // clear cart
    setCart([]);
    localStorage.removeItem("cart");

    setOrderId(newOrderId);
    setOrderPlaced(true);
  };

  // ================= WHATSAPP =================
  const whatsappMessage = `Hello, I just placed an order.

Order ID: ${orderId}
Amount: ₦${finalTotal}

I have made payment.`;

  const whatsappLink = `https://wa.me/2347026174894?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // ================= SUCCESS SCREEN =================
  if (orderPlaced) {
    return (
      <div style={{ padding: "1rem", maxWidth: "500px", margin: "auto" }}>
        <h2>Order Placed ✅</h2>

        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Total:</strong> ₦{finalTotal}</p>

        {/* ✅ NEW DEBUG MESSAGE */}
        <p style={{ color: "green", fontWeight: "bold" }}>
          {responseMsg}
        </p>

        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "10px" }}>
          <h3>Bank Details</h3>
          <p>Bank: Opay</p>
          <p>Account Name: CHIBUNDO JULIET OJIDE</p>
          <p>Account Number: 7026174894</p>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            marginTop: "1rem",
            background: "#25D366",
            color: "white",
            padding: "12px",
            textAlign: "center",
            borderRadius: "8px"
          }}
        >
          Send Receipt on WhatsApp
        </a>

        <button
          onClick={goToHome}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "10px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>Your basket is empty</p>
      ) : (
        <>
          <h3>Order Summary</h3>

          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} = ₦
                {item.price * item.quantity}
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
              gap: "10px",
              maxWidth: "400px"
            }}
          >
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              type="submit"
              style={{
                padding: "10px",
                background: "#ff6600",
                color: "white",
                border: "none"
              }}
            >
              Place Order
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Checkout;