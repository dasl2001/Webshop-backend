import express from "express";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

//Hämta produkter (alla eller filtrerat på namn)
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    let filter = {};

    if (name && name.trim() !== "") {
      filter.name = { $regex: new RegExp(name, "i") };
    }

    const products = await Product.find(filter).populate("category");

    //Om namn har angetts men inga produkter hittades
    if (name && name.trim() !== "" && products.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Hämta en specifik produkt
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ error: "Produkt hittades inte" });
    }
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: "Produkt hittades inte" });
  }
});

//Skapa ny produkt (endast admin)
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Uppdatera produkt (endast admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Kunde inte hitta produkten att uppdatera" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Radera produkt (endast admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Produkten hittades inte" });
    }
    res.json({ message: "Produkt raderad", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;








