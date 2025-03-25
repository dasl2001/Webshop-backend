// routes/products.js
import express from "express";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    if (!product)
      return res.status(404).json({ error: "Produkt hittades inte" });
    res.json(product);
  } catch (error) {
    console.warn("Failed to fetch product", error);
    res.status(404).json({ error: "Product not found" });
  }
});

// Create product (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    // Använd en filterobjekt istället för att skicka id direkt
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Produkt att uppdatera hittades inte" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.warn("Error updating product", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete product (admin only) – implementation kan läggas till senare
// router.delete("/:id", adminAuth, async (req, res) => { ... });

export default router;
