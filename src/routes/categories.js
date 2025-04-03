import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

//Hämta alla kategorier eller en specifik kategori + dess produkter
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    //Om name finns men är tomt
    if (typeof name === "string" && name.trim() === "") {
      return res.status(400).json({ error: "Sökterm får inte vara tom" });
    }

    //Om name finns → hämta kategori och dess produkter
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

    //Ingen name-sökning → hämta alla kategorier
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;









