import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Hämta alla produkter
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hämta en produkt med ID
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

// 🔍 Sök produkter
router.get("/search", async (req, res) => {
  const { q, category, minPrice, maxPrice, sortBy = "name", order = "asc" } = req.query;

  const filter = {};

  // Textsökning
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { name: { $regex: regex } },
      { description: { $regex: regex } }
    ];
  }

  // Prisintervall
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Kategori (id eller namn)
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json({ error: `Kategorin '${category}' hittades inte.` });
      }
      filter.category = foundCategory._id;
    }
  }

  const sort = {};
  sort[sortBy] = order === "desc" ? -1 : 1;

  try {
    const results = await Product.find(filter).populate("category").sort(sort);
    if (results.length === 0) {
      return res.status(404).json({ message: "Inga produkter hittades." });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Skapa ny produkt
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Uppdatera produkt
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
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

// Radera produkt
router.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Produkten hittades inte" });
    }
    res.json({ message: "Produkten raderades", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

