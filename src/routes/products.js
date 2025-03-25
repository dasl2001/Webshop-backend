// api/products.js
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
};

export default async function handler(req, res) {
  await connectDB();

  const { method, query } = req;
  const { id } = query;

  try {
    if (method === "GET") {
      if (id) {
        const product = await Product.findById(id).populate("category");
        if (!product) return res.status(404).json({ error: "Produkt hittades inte" });
        return res.status(200).json(product);
      }

      const products = await Product.find().populate("category");
      return res.status(200).json(products);
    }

    if (method === "POST") {
      let { category, ...rest } = req.body;

      if (!mongoose.Types.ObjectId.isValid(category)) {
        const foundCategory = await Category.findOne({ name: category });
        if (!foundCategory) {
          return res.status(400).json({ error: `Kategorin "${category}" finns inte.` });
        }
        category = foundCategory._id;
      }

      const product = new Product({ ...rest, category });
      await product.save();

      return res.status(201).json(product);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


