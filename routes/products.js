const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const validateProduct = require("../middleware/validation");
const NotFoundError = require("../errors/NotFoundError");
// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// GET /api/products - Get all products with filtering, searching and pagination.
router.get("/", (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;

  // Start with all products
  let result = products;

  // Filtering by category
  if (category) {
    result = result.filter((p) => p.category === category);
  }

  // Searching by name
  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination setup
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const paginatedProducts = result.slice(
    startIndex,
    startIndex + parseInt(limit)
  );

  const authMiddleware = require("../middleware/auth"); // Ensure correct path

  res.json(paginatedProducts);
});
// GET products by id.
router.get("/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.json(product);
});

// POST new produc with validation & authentication
router.post("/", authMiddleware, validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: Date.now().toString(),
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
router.put("/:id", authMiddleware, validateProduct, (req, res, next) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) return next(new NotFoundError("Product not found"));

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
});

//DELETE product
router.delete("/:id", authMiddleware, (req, res, next) => {
  const { id } = req.params;
  const newProducts = products.filter((p) => p.id !== id);
  if (newProducts.length === products.length)
    return next(new NotFoundError("Product not found"));

  products = newProducts;
  res.json({ message: "Product deleted" });
});

// GET product statistics
router.get("/stats", (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  res.json(stats);
});

module.exports = router;
