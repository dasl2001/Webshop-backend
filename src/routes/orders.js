import express from "express";
import Order from "../models/Order.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

//Skapa ny order (alla kan använda)
router.post("/", async (req, res) => {
  const { name, address, phone, total } = req.body;

  if (!name || !address || !phone || !total) {
    return res.status(400).json({ error: "Alla fält krävs" });
  }

  try {
    const newOrder = new Order({ name, address, phone, total });
    await newOrder.save();

    res.status(201).json({
      message: `Beställningen är mottagen. Swisha ${total} kr till 123 456.`,
      orderId: newOrder._id
    });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte spara beställningen" });
  }
});

//Hämta en order via ID (utan token)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order hittades inte" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Något gick fel" });
  }
});

//Admin kan hämta order med ID (med token)
router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order hittades inte" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Något gick fel" });
  }
});

//Admin ser alla beställningar
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta beställningar" });
  }
});

//Admin ser bara dagens beställningar
router.get("/admin/today", adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    res.json({
      date: today.toISOString().split("T")[0],
      count: todaysOrders.length,
      orders: todaysOrders
    });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta dagens beställningar" });
  }
});

export default router;



