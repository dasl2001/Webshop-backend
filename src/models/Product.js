import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }, 
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  comparePrice: {
    type: String,
    default: "",
  },
  ingredients: {
    type: String,
    default: "",
  },
  nutrition: {
    type: String,
    default: "",
  },
  supplier: {
    type: String,
    default: "",
  },
  brand: {
    type: String,
    default: "",
  },
  originCountry: {
    type: String,
    default: "",
  },
},
{ timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
export default Product;




