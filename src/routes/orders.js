import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/orders – spara beställning
router.post("/", async (req, res) => {
  try {
    const { name, address, phone, total } = req.body;

    if (!name || !address || !phone || !total) {
      return res.status(400).json({ error: "Alla fält krävs" });
    }

    const newOrder = new Order({ name, address, phone, total });
    await newOrder.save();

    res.status(201).json({
      message: `Beställningen är mottagen. Swisha ${total} kr till 123 456.`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
