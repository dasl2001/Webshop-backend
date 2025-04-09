import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Skapa ny beställning (öppen för alla)
router.post("/", async (req, res) => {
  const { name, address, phone, items } = req.body;

  if (!name || !address || !phone || !items || items.length === 0) {
    return res.status(400).json({ error: "Fyll i alla fält och minst 1 produkt" });
  }

  try {
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ error: "Produkt hittades inte" });
      total += product.price * item.quantity;
    }

    const newOrder = new Order({ name, address, phone, total, items });
    await newOrder.save();

    res.status(201).json({
      message: `Beställningen är mottagen. Swisha ${total} kr till 123 456.`,
      orderId: newOrder._id,
    });
  } catch {
    res.status(500).json({ error: "Kunde inte spara beställningen" });
  }
});

// Admin dagens beställningar
router.get("/admin/today", adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
    }).populate("items.product").sort({ createdAt: -1 });

    res.json({
      date: today.toISOString().split("T")[0],
      count: todaysOrders.length,
      orders: todaysOrders,
    });
  } catch {
    res.status(500).json({ error: "Kunde inte hämta dagens beställningar" });
  }
});

// Admin uppdatera status
router.put("/admin/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;

  if (!["under behandling", "skickad", "mottagen"].includes(status)) {
    return res.status(400).json({ error: "Felaktig status" });
  }

  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.product");

    if (!updated) return res.status(404).json({ error: "Order hittades inte" });

    res.json({ message: "Status uppdaterad", order: updated });
  } catch {
    res.status(500).json({ error: "Kunde inte uppdatera status" });
  }
});

// Admin alla beställningar
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Kunde inte hämta beställningar" });
  }
});

// Admin specifik order
router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ error: "Order hittades inte" });
    res.json(order);
  } catch {
    res.status(500).json({ error: "Fel vid hämtning av order" });
  }
});

//Användare kan se sin order 
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









