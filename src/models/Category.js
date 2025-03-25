import mongoose from "mongoose";

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

const Kategori = mongoose.model("Kategori", kategoriSchema);
export default Kategori;

