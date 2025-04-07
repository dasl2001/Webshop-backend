import express from "express";
import Order from "../models/Order.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

/*
  POST /api/orders – Skapa en ny beställning (öppen för alla)
*/
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
      orderId: newOrder._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
  GET /api/orders/:id – Vanlig användare kan hämta sin order via ID (utan token)
*/
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order hittades inte" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Fel vid hämtning av order" });
  }
});

/*
  GET /api/orders/admin/:id – Admin kan hämta order med token
*/
router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order hittades inte" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Fel vid hämtning av order" });
  }
});

/*
  GET /api/orders – Endast admin får se alla beställningar
*/
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


