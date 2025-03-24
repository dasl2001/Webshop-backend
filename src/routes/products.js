import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

//Hämta alla produkter
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Hämta en specifik produkt
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ error: "Produkt hittades inte" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Skapa ny produkt (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Uppdatera en produkt (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Produkt att uppdatera hittades inte" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Radera en produkt (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Produkt att radera hittades inte" });
    res.json({ message: "Produkt raderad", product: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Hämta produkter via kategori-namn
router.get("/by-category/:category", async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.category });
    if (!category) {
      return res.status(404).json({
        error: `Ingen kategori med namnet "${req.params.category}" hittades.`,
      });
    }

    const products = await Product.find({ category: category._id });

    if (products.length === 0) {
      return res.status(404).json({ products: [], error: "Inga produkter hittades." });
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
