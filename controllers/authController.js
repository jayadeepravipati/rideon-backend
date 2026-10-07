import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"; // ✅ Import asyncHandler
import generateToken from "../utils/generateToken.js"; // ✅ Import generateToken

// 🔹 Register a new user
export const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: role || "customer" });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error registering user" });
  }
});

// 🔹 Login user
export const login = asyncHandler(async (req, res) => { // ✅ Renamed function to `login`
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, 
      token: generateToken(user._id, user.role), // ✅ Pass role for better auth handling
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// 🔹 Get all users (Admin only)
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});
