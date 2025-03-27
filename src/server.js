import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";

dotenv.config();

const app = express();
app.use(cors('*'));
app.use(express.json());

//Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB ansluten");
    app.listen(PORT, () =>
      console.log(`Servern körs på http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Fel vid anslutning till MongoDB", err);
  });
