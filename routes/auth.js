import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Bike from "../models/Bike.js"; // Import Bike model
import adminAuth from "../middleware/adminAuth.js"; // Middleware for admin authentication

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Admin - Add a New Bike
router.post("/addbike", adminAuth, async (req, res) => {
  try {
    if (!req.admin.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { name, model, location, pricePerDay, imageUrl } = req.body;

    if (!name || !model || !location || !pricePerDay || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBike = new Bike({
      name,
      model,
      location,
      pricePerDay,
      imageUrl,
    });

    await newBike.save();
    res.status(201).json({ message: "Bike added successfully", bike: newBike });
  } catch (error) {
    console.error("Add bike error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
