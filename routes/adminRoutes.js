import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { addBike, deleteBike, getAllUsers, deleteUser, getAllOrders, deleteOrder } from "../controllers/adminController.js";

dotenv.config();
const router = express.Router();

// Admin Registration (temporary for testing)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered", adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin - Manage Bikes
router.post("/bikes", protect, adminOnly, addBike);
router.delete("/bikes/:id", protect, adminOnly, deleteBike);

// Admin - Manage Users
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Admin - Manage Orders
router.get("/orders", protect, adminOnly, getAllOrders);
router.delete("/orders/:id", protect, adminOnly, deleteOrder);

export default router;