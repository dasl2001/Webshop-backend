const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 250,
  },
  description: { type: String, trim: true },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
