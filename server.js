// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());


// Root route
app.get("/", (req, res) => {
  res.send(
    "Hello World, Welcome to the Product API! Go to /api/products to see all products."
  );
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);


// TODO: Implement custom middleware for:
// - Request logging
// middleware for logging requests
const logger = require("./middleware/logger");
app.use(logger);

// - Authentication


// - Error handling
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
