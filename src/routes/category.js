const express = require('express');
const Kategori = require('../models/category.model.js');

const router = express.Router();

// Middleware för att kontrollera adminbehörighet
const adminCheck = (req, res, next) => {
  const user = req.user; // 
  if (user && user.isAdmin) { 
    next();
  } else {
    res.status(403).json({ message: 'Endast admin har behörighet' });
  }
};

// Hämta alla kategorier med sökmöjlighet
router.get('/', async (req, res) => {
  try {
    const filter = {};

    
    if (req.query.sok) {
      const sokTerm = req.query.sok;
      filter.$or = [
        { namn: { $regex: sokTerm, $options: 'i' } }, 
        { beskrivning: { $regex: sokTerm, $options: 'i' } }, 
        { typ: { $regex: sokTerm, $options: 'i' } } 
      ];
    }

    const kategorier = await Kategori.find(filter);
    res.json(kategorier);
  } catch (error) {
    res.status(500).json({ message: 'Fel vid hämtning av kategorier', error });
  }
});

router.post('/', adminCheck, async (req, res) => {
  try {
    const nyKategori = new Kategori(req.body);
    const sparadKategori = await nyKategori.save();
    res.status(201).json(sparadKategori);
  } catch (error) {
    res.status(400).json({ message: 'Fel vid skapande av kategori', error });
  }
});

module.exports = router;