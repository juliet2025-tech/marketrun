import React from "react";

function Header({ goToHome, goToBasket, goToCheckout, cartCount , goToOrders, }) {
  return (
    <header className="header">
      <nav className="nav">
        {/* ✅ Logo (click = go home) */}
        <h1 
          className="logo" 
          onClick={goToHome} 
          style={{ cursor: "pointer" }}
        >
          PureFoods
        </h1>

        {/* ✅ Navigation links */}
        <ul className="nav-links">
          <li onClick={goToHome} style={{ cursor: "pointer" }}>
            Home
          </li>

          <li onClick={goToBasket} style={{ cursor: "pointer" }}>
            Basket ({cartCount})
          </li>

          <li onClick={goToCheckout} style={{ cursor: "pointer" }}>
            Checkout
          </li>
 

        </ul>
      </nav>
    </header>
  );
}

export default Header;