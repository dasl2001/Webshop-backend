const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
  namn: {
    type: String,
    required: true,
    trim: true
  },
  beskrivning: {
    type: String,
    trim: true
  },
  typ: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Kategori', kategoriSchema);
