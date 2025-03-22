
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//Skapa ny produkt
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Hämta alla produkter
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Hämta en specifik produkt
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produkt hittades inte' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Uppdatera en produkt
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Ta bort en produkt
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produkt raderad' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

