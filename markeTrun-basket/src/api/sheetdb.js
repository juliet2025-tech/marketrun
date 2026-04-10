import axios from "axios";

// ✅ Products Sheet
const PRODUCTS_API = "https://sheetdb.io/api/v1/m0zl4zruvue3r";

// ✅ Orders Sheet
const ORDERS_API = "https://sheetdb.io/api/v1/lsiil5o8chh5a";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const res = await axios.get(PRODUCTS_API);
    return res.data; // Returns array of products
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
};

// Add an order (custom or normal) to Orders Sheet
export const addOrder = async (order) => {
  try {
    const res = await axios.post(ORDERS_API, { data: order });
    return res.data;
  } catch (err) {
    console.error("Error adding order:", err);
  }
};