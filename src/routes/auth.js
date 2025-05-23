import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
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
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Fyll i användarnamn/e-post och lösenord" });
    }
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }
    if (!user.admin) {
      return res.status(403).json({ error: "Otillräckliga rättigheter" });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      message: "Välkommen admin",
      token,
      user: {
        username: user.username,
        email: user.email,
        admin: user.admin,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/login-user", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Fyll i användarnamn/e-post och lösenord" });
    }
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }
    if (user.admin) {
      return res.status(403).json({ error: "Endast vanliga användare har åtkomst här" });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      message: "Välkommen användare",
      token,
      user: {
        username: user.username,
        email: user.email,
        admin: user.admin,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;


