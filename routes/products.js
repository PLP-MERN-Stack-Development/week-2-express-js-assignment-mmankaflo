const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); 

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


    router.post("/", authMiddleware, (req, res) => {
      const { name, category, price, inStock } = req.body;

      if (!name || !category || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newProduct = {
        id: Date.now().toString(),
        name,
        category,
        price,
        inStock,
      };
      products.push(newProduct);

      res.status(201).json(newProduct);
    });


    router.put("/:id", authMiddleware, (req, res) => {
      const { id } = req.params;
      const { name, category, price, inStock } = req.body;

      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
      }

      products[productIndex] = { id, name, category, price, inStock };
      res.json(products[productIndex]);
    });

    router.delete("/:id", authMiddleware, (req, res) => {
      const { id } = req.params;
      products = products.filter((p) => p.id !== id);
      res.json({ message: "Product deleted" });
    });

    module.exports = router;