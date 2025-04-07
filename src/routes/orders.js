import express from "express";
import Order from "../models/Order.js";
import { adminAuth } from "../middleware/auth.js"; 

const router = express.Router();

// Route för att skapa en ny beställning
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route för att hämta alla beställningar (endast admin)
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;