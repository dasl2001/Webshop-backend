import express from "express";
import Order from "../models/Order.js";
import { adminAuth, auth } from "../middleware/auth.js";

const router = express.Router();

/*
  POST /api/orders – Skapa en ny beställning (vanlig användare)
*/
router.post("/", auth, async (req, res) => {
  try {
    const { name, address, phone, total } = req.body;

    if (!name || !address || !phone || !total) {
      return res.status(400).json({ error: "Alla fält krävs" });
    }

    const newOrder = new Order({
      name,
      address,
      phone,
      total,
      userId: req.user.id,
    });

    await newOrder.save();

    res.status(201).json({
      message: `Beställningen är mottagen. Swisha ${total} kr till 123 456.`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
  GET /api/orders/:id – Hämta specifik order (endast ägare eller admin)
*/
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order hittades inte" });
    }

    if (req.user.admin || order.userId.toString() === req.user.id) {
      return res.json(order);
    } else {
      return res.status(403).json({ error: "Otillräckliga rättigheter" });
    }
  } catch (error) {
    res.status(500).json({ error: "Fel vid hämtning av order" });
  }
});

/*
  GET /api/orders – Hämta alla beställningar (endast admin)
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
