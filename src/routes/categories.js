import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

/*
Skapa ny kategori (endast admin)
*/
router.post("/", adminAuth, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/*
Uppdatera kategori (endast admin)
*/
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Kategorin hittades inte" });
    }
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
Radera kategori (endast admin) – om inga produkter är kopplade
*/
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const categoryId = req.params.id;

    //Kontrollera om det finns produkter kopplade till denna kategori
    const productCount = await Product.countDocuments({ category: categoryId });

    if (productCount > 0) {
      return res.status(400).json({
        error: "Kategorin kan inte raderas eftersom det finns produkter kopplade till den."
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Kategorin hittades inte" });
    }

    res.status(200).json({ message: "Kategori raderad" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
Hämta alla kategorier eller en specifik kategori + dess produkter
(öppen för alla)
*/
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    //Om name finns men är tomt
    if (typeof name === "string" && name.trim() === "") {
      return res.status(400).json({ error: "Sökterm får inte vara tom" });
    }

    //Om name finns (hämta kategori och dess produkter)
    if (typeof name === "string") {
      const category = await Category.findOne({
        name: { $regex: new RegExp(name, "i") }
      });

      if (!category) {
        return res.status(404).json({ error: "Kategorin hittades inte" });
      }

      const products = await Product.find({ category: category._id }).populate("category");

      return res.json({ category, products });
    }

    //Ingen name-sökning (hämta alla kategorier)
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;











