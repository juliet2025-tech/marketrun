import React, { useState } from "react";

const ORDER_API = "https://sheetdb.io/api/v1/lsiil5o8chh5a";

function Checkout({ cart, setCart, goToHome }) {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [orderId, setOrderId] = useState("");
  const [orderSent, setOrderSent] = useState(false);

  // ================= CALCULATION =================
  const total = cart.reduce((acc, item) => {
    return acc + Number(item.price) * Number(item.quantity);
  }, 0);

  const serviceFee = Math.max(500, total * 0.1);
  const finalTotal = total + serviceFee;

  // ================= SNAPSHOT STATE (IMPORTANT FIX) =================
  const [snapshot, setSnapshot] = useState(null);

  // ================= STEP 1 =================
  const handleContinue = (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    setStep(2);
  };

  // ================= STEP 2 =================
  const handlePlaceOrder = async () => {
      console.log("🔥 HANDLE PLACE ORDER FIRED");
    const id = `ORD-${Date.now()}`;

  console.log("ORDER ID:", id);
  console.log("TOTAL:", total);
  console.log("SERVICE:", serviceFee);
  console.log("FINAL:", finalTotal);

    // 🔥 TAKE SNAPSHOT BEFORE CLEARING CART
    const orderSnapshot = {
      cartSnapshot: [...cart],
      totalSnapshot: total,
      serviceSnapshot: serviceFee,
      finalSnapshot: finalTotal,
      name,
      phone
    };

    setSnapshot(orderSnapshot);
    setOrderId(id);

    // ================= SAVE TO SHEET =================
    const summary = cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} x${item.quantity} - ₦${
            item.price * item.quantity
          }`
      )
      .join("\n");

     // 🔥 FIRE AND FORGET FETCH (NO await)
    fetch(ORDER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
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
          payment_status: "Pending",
          delivery_status: "Yet to Deliver",
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ SAVED:", data))
      .catch((err) => console.error("❌ ERROR:", err));

    // UI updates instantly
    setCart([]);
    localStorage.removeItem("cart");
    setOrderSent(true);
  };
  
  // ================= WHATSAPP MESSAGE (FIXED) =================
  const whatsappMessage = `Hello, I just placed an order.

Order ID: ${orderId}
Name: ${name}
Phone: ${phone}

Total: ₦${snapshot?.totalSnapshot || 0}
Service Fee: ₦${snapshot?.serviceSnapshot || 0}
Amount Paid: ₦${snapshot?.finalSnapshot || 0}

I have made payment.`;

  const whatsappLink = `https://wa.me/2347026174894?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div style={{ padding: "1rem", maxWidth: "500px", margin: "auto" }}>
      <h2>Checkout</h2>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity} = ₦
              {item.price * item.quantity}
            </p>
          ))}

          <h3>Total: ₦{total}</h3>
          <p>Service Fee: ₦{serviceFee}</p>
          <h3>Final Total: ₦{finalTotal}</h3>

          <form onSubmit={handleContinue}>
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <button type="submit" style={{ width: "100%" }}>
              Continue to Payment
            </button>
          </form>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && !orderSent && (
        <>
          <h3>Payment Details</h3>

          <div style={{ background: "#f5f5f5", padding: "1rem" }}>
            <p><b>Bank:</b> Opay</p>
            <p><b>Account Name:</b> CHIBUNDO JULIET OJIDE</p>
            <p><b>Account Number:</b> 7026174894</p>
          </div>

          <h3>Amount to Pay: ₦{finalTotal}</h3>

          <button
          type="button"
            onClick={handlePlaceOrder}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "10px",
              background: "black",
              color: "white",
            }}
          >
            I Have Made Payment
          </button>
        </>
      )}

      {/* ================= SUCCESS ================= */}
      {orderSent && (
        <>
          <h2>Order Successful ✅</h2>
          <p><b>Order ID:</b> {orderId}</p>

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
              borderRadius: "8px",
            }}
          >
            Send Receipt on WhatsApp
          </a>

          <button
            onClick={goToHome}
            style={{ marginTop: "1rem", width: "100%", padding: "10px" }}
          >
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;