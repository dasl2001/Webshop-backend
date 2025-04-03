/* 
Importering av moduler
*/
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

/*
Tar emot: username, email, password
Kollar att alla fält är ifyllda
Ser till att e-post eller användarnamn inte redan finns
Skapar ny användare
Hashning sker automatiskt i User-modellen via pre("save")
*/
const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Alla fält krävs" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Användarnamn eller e-post används redan" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "Användare skapad" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
Letar efter användare baserat på username eller email
Jämför lösenordet med bcrypt
Skapar en JWT-token om det matchar
Returnerar:
- 401 om användaren inte finns eller lösenordet är fel
- 403 om användaren är inloggad men inte admin
*/
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Fyll i användarnamn/e-post och lösenord" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }

    //Kontrollera admin-rättigheter
    if (!user.admin) {
      return res.status(403).json({ error: "Otillräckliga rättigheter" });
    }

    /*
    JWT innehåller ID, e-post och adminstatus
    Signeras med JWT_SECRET från .env
    Giltig i 2 timmar ("2h")
    */
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        admin: user.admin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

