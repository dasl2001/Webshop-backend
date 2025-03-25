// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";

dotenv.config();

const app = express();
app.use(express.json());

// Använd dina routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Servern körs på http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
