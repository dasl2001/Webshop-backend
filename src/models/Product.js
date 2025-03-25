import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Anslut till MongoDB
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

  const { method, query, body } = req;
  const id = query.id;

  try {
    switch (method) {
      case "GET":
        if (id) {
          const product = await Product.findById(id).populate("category");
          if (!product) return res.status(404).json({ error: "Produkt hittades inte" });
          return res.status(200).json(product);
        }
        const products = await Product.find().populate("category");
        return res.status(200).json(products);

      case "POST":
        // Om kategori är ett namn, hämta dess ID
        let category = body.category;
        if (!mongoose.Types.ObjectId.isValid(category)) {
          const found = await Category.findOne({ name: category });
          if (!found) return res.status(400).json({ error: "Kategorin finns inte" });
          category = found._id;
        }
        const newProduct = new Product({ ...body, category });
        await newProduct.save();
        return res.status(201).json(newProduct);

      case "PUT":
        if (!id) return res.status(400).json({ error: "Produktens ID krävs" });
        const updated = await Product.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return res.status(404).json({ error: "Produkten hittades inte" });
        return res.status(200).json(updated);

      case "DELETE":
        if (!id) return res.status(400).json({ error: "Produktens ID krävs" });
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Produkten hittades inte" });
        return res.status(200).json({ message: "Produkt raderad" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Metoden ${method} är inte tillåten`);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



