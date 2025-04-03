import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js"; 
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

//Skapa ny kategori (endast admin)
router.post("/", adminAuth, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

//Uppdatera kategori (endast admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = { ...req.body };
    delete categoryData._id;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Kategori hittades inte" });
    }

    res.status(200).json({ data: updatedCategory });
  } catch (error) {
    console.error("Fel vid uppdatering av kategori:", error);
    res.status(500).json({ error: error.message });
  }
});

//Radera kategori (endast admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Kategori hittades inte" });
    }

    res.status(200).json({ message: "Kategori raderad" });
  } catch (error) {
    console.error("Fel vid radering av kategori:", error);
    res.status(500).json({ error: error.message });
  }
});

//Hämta alla kategorier
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Hämta en specifik kategori via ID (öppen för alla)
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Kategorin hittades inte" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Hämta produkter i en viss kategori via namn
router.get("/:categoryName/products", async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await Category.findOne({
      name: { $regex: new RegExp(categoryName, "i") }
    });

    if (!category) {
      return res.status(404).json({ error: "Kategorin hittades inte" });
    }

    const products = await Product.find({ category: category._id }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    console.error("Fel vid hämtning av produkter för kategori:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;



