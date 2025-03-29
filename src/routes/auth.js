import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

//POST /api/auth/register
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

//POST /api/auth/login (med username eller email)
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
      return res.status(401).json({ error: "Fel användarnamn eller e-post" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Fel lösenord" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, user: { username: user.username, email: user.email, admin: user.admin } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

