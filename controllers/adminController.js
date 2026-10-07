import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Bike from "../models/Bike.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ====================== ADMIN AUTH ======================
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: admin._id,
      username: admin.username,
      role: admin.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// ====================== BIKE MANAGEMENT ======================
// export const addBike = async (req, res) => {
//   try {
//     const { name, type, pricePerDay, location } = req.body;
//     const newBike = await Bike.create({ name, type, pricePerDay, location });
//     res.status(201).json(newBike);
//   } catch (error) {
//     res.status(400).json({ message: "Invalid bike data", error: error.message });
//   }
// };
export const addBike = async (req, res) => {
  try {
    const { name, type, pricePerDay, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newBike = await Bike.create({
      name,
      type,
      pricePerDay,
      location,
      image: {
        data: req.file.buffer,      // Binary image data
        contentType: req.file.mimetype // MIME type
      }
    });

    res.status(201).json({
      _id: newBike._id,
      name: newBike.name,
      type: newBike.type,
      imageUrl: `/api/bikes/${newBike._id}/image` // Endpoint to fetch image
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Bike Image (returns the actual image)
export const getBikeImage = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike || !bike.image.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set proper content-type and send binary data
    res.set("Content-Type", bike.image.contentType);
    res.send(bike.image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bike", error: error.message });
  }
};

// ====================== USER MANAGEMENT ======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// ====================== ORDER MANAGEMENT ======================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "email")
      .populate("bike", "name");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};