// src/api/sheetdb.js
import axios from "axios";

const API_URL = "https://sheetdb.io/api/v1/m0zl4zruvue3r";

// Fetch all products/orders
export const fetchProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data; // SheetDB returns array of objects
  } catch (err) {
    console.error("Error fetching from SheetDB:", err);
    return [];
  }
};

// Add an order to the sheet
export const addOrder = async (order) => {
  try {
    const res = await axios.post(API_URL, { data: order });
    return res.data;
  } catch (err) {
    console.error("Error adding order to SheetDB:", err);
  }
};