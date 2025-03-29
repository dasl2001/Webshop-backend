import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Fel e-post eller lösenord" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Fel e-post eller lösenord" });

    const token = jwt.sign(
      { id: user._id, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Skapa ny användare 
router.post("/register", async (req, res) => {
  try {
    const { email, password, admin = false } = req.body;
    const newUser = new User({ email, password, admin });
    await newUser.save();
    res.status(201).json({ message: "Användare skapad" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
