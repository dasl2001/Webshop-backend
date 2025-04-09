import express from "express";
import Order from "../models/Order.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

/*
POST – Ny beställning 
*/
router.post("/", async (req, res) => {
  const { name, address, phone, total, items } = req.body;

  // Kontrollera att allt finns
  if (!name || !address || !phone || !total || !items || items.length === 0) {
    return res.status(400).json({ error: "Alla fält krävs och minst 1 produkt" });
  }

  try {
    const newOrder = new Order({ name, address, phone, total, items });
    await newOrder.save();

    res.status(201).json({
      message: `Beställningen är mottagen. Swisha ${total} kr till 123 456.`,
      orderId: newOrder._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte spara beställningen" });
  }
});

/*
ADMIN – Dagens beställningar plus produkter
*/
router.get("/admin/today", adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    })
    .populate("items.product")
    .sort({ createdAt: -1 });

    res.json({
      date: today.toISOString().split("T")[0],
      count: todaysOrders.length,
      orders: todaysOrders
    });
  } catch {
    res.status(500).json({ error: "Kunde inte hämta dagens beställningar" });
  }
});

/*
ADMIN – En specifik order plus produkter
*/
router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ error: "Order hittades inte" });
    res.json(order);
  } catch {
    res.status(500).json({ error: "Fel vid hämtning av order" });
  }
});

/*
ADMIN – Alla beställningar plus produkter
*/
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Kunde inte hämta beställningar" });
  }
});

/*
Vanlig användare hämtar sin order
*/
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ error: "Order hittades inte" });
    res.json(order);
  } catch {
    res.status(500).json({ error: "Fel vid hämtning av order" });
  }
});

export default router;






