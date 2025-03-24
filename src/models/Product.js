// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  /*
  // Implementera senare vid tid
  imageUrl: {
    type: String,
    required: false // Bild är valfri, men rekommenderad
  },
  */
  category: {
    type: String,
    required: true
  },
  inStock: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Product', productSchema);

