// src/api/trends.js
import axios from "axios";

// Base URL from Vite environment variable
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Create a reusable Axios instance with longer timeout for scraping
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes timeout for scraping operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a separate instance for quick operations
const quickApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds for quick operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API responses and errors
const handleRequest = async (request) => {
  try {
    const response = await request;
    if (response.data?.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Unknown error from API");
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error("Request timeout - scraping took too long. Please try again.");
    } else if (error.response?.status === 500) {
      throw new Error(error.response?.data?.detail || "Server error occurred");
    } else if (error.response?.status === 404) {
      throw new Error("No data found");
    } else {
      console.error("API Error:", error.message);
      throw error;
    }
  }
};

// ✅ Call POST /scrape to run Selenium scraper (with longer timeout)
export const scrapeTrends = async () => {
  return handleRequest(api.post("/scrape"));
};

// ✅ Call GET /trends to get the latest trend (quick operation)
export const getLatestTrends = async () => {
  return handleRequest(quickApi.get("/trends"));
};

// ✅ Call GET /trends/all with pagination (quick operation)
export const getAllTrends = async (limit = 10, offset = 0) => {
  return handleRequest(quickApi.get(`/trends/all?limit=${limit}&offset=${offset}`));
};

// ✅ Call GET /trends/{trend_id} to get a specific trend by ID (quick operation)
export const getTrendById = async (trend_id) => {
  return handleRequest(quickApi.get(`/trends/${trend_id}`));
};

// ✅ Call DELETE /trends/{trend_id} to delete a trend by ID (quick operation)
export const deleteTrendById = async (trend_id) => {
  return handleRequest(quickApi.delete(`/trends/${trend_id}`));
};

// ✅ Call GET /health to check backend + DB health (quick operation)
export const checkHealth = async () => {
  return handleRequest(quickApi.get("/health"));
};