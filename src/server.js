/*
Importering av filer om mudler
*/
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js";

/*
Initiera appen och läs .env filen
*/
dotenv.config();
const app = express();

/*
CORS tillåter  frontend att anropa backend.
*/
app.use(cors('*'));
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "https://webshop-2025-fe.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

/*
Automatiskt parsar inkommande JSON
*/
app.use(express.json());

/*
Routing
*/
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

/*
Läser porten från .env, annars standard 3000
*/
const PORT = process.env.PORT || 3000;

/*
Här ansluter du till databasen (via URI i .env)
När databasen är ansluten → startas servern
Om något går fel loggas det i konsolen
*/
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB ansluten");
    app.listen(PORT, () =>
      console.log(`Servern körs på http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Fel vid anslutning till MongoDB", err);
  });
