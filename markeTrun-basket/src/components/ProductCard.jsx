import React from "react";

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
      <img src={product.image} alt={product.name} width={100} />
      <h3>{product.name}</h3>
      <p>₦{product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Basket</button>
    </div>
  );
}

export default ProductCard;