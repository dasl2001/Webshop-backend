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

// Skapa id för att se kundbeställnningar, för admin. Två separata sökvägar för admin och användare. 

const express = require('express')
const app = express()

app.use(express.json())

let orders = []
let currentId = 1

// Skapa beställning (kund) 
app.post('/order', (req, res) => {
  const { customerName, items } = req.body;

  const order = {
    id: currentId++,
    customerName,
    items
  }

  orders.push(order);
  res.status(201).json(order)
})

// Admin – hämta alla beställningar
app.get('/admin/orders', (req, res) => {
  res.json(orders);
})

app.listen(3000, () => {
  console.log('Servern körs på port 3000')
})
