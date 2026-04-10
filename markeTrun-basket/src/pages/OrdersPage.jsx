import React, { useState } from "react";

const ORDER_API = "https://sheetdb.io/api/v1/lsiil5o8chh5a";

function PaymentPage({ orderId, cart, finalTotal, goToHome }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ================= CONFIRM PAYMENT =================
  const confirmPayment = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${ORDER_API}/order_id/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              payment_status: "Paid"
            }
          })
        }
      );

      const result = await res.json();

      if (result.updated || result.success) {
        setMsg("Payment confirmed successfully ✅");
      } else {
        setMsg("Payment sent but not confirmed ❗");
      }
    } catch (error) {
      console.error(error);
      setMsg("Error confirming payment ❌");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px", margin: "auto" }}>
      <h2>Payment Page</h2>

      {/* ORDER INFO */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1rem"
        }}
      >
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Amount to Pay:</strong> ₦{finalTotal}</p>
      </div>

      {/* BANK DETAILS */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1rem"
        }}
      >
        <h3>Bank Details</h3>
        <p><strong>Bank:</strong> Opay</p>
        <p><strong>Account Name:</strong> CHIBUNDO JULIET OJIDE</p>
        <p><strong>Account Number:</strong> 7026174894</p>
      </div>

      {/* PAYMENT INSTRUCTIONS */}
      <div
        style={{
          background: "#fff7e6",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1rem"
        }}
      >
        <p>⚠️ Please transfer the exact amount above.</p>
        <p>After payment, click the button below.</p>
      </div>

      {/* CONFIRM BUTTON */}
      <button
        onClick={confirmPayment}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "#25D366",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}
      >
        {loading ? "Confirming..." : "I Have Paid"}
      </button>

      {/* MESSAGE */}
      {msg && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          {msg}
        </p>
      )}

      {/* BACK */}
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

export default PaymentPage;