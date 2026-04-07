import React from "react";

function Basket({ cart, setCart , goToCheckout , setToastMessage }) {
  // Increase quantity
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
  };

  // Remove item
  const removeItem = (id) => {
    const itemToRemove = cart.find(item => item.id === id); // ✅ get item name
    setCart(cart.filter((item) => item.id !== id));
    setToastMessage(`${itemToRemove.name} removed from basket`);
  };

  // Calculate total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="basket-page">
      <h2>Your Basket</h2>

      {cart.length === 0 ? (
        <p>Your basket is empty</p>
      ) : (
        <div className="basket-items">
          {cart.map((item) => (
            <div key={item.id} className="basket-item">

              <img  src={item.image || "/placeholder.png"}
               alt={item.name} width={80}
                style={{
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
                onError={(e) => (e.target.src = "/placeholder.png")} />
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>₦{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="item-buttons">
                  <button onClick={() => increaseQty(item.id)}>+</button>
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <h3>Total: ₦{total}</h3>
          {/* ✅ Checkout button added directly under total */}
{/* - Calls goToCheckout prop to navigate to the checkout page */}
{/* - Should only show if cart has items */}
{cart.length > 0 && (
  <button onClick={goToCheckout}>
    Proceed to Checkout
  </button>
)}
          
        </div>
      )}
    </div>
  );
}

export default Basket;