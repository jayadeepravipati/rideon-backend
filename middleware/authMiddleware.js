import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Check Admin collection first
      req.user = await Admin.findById(decoded.id).select("-password");
      console.log("Admin found:", req.user);

      // If no admin, check User collection
      if (!req.user) {
        req.user = await User.findById(decoded.id).select("-password");
        console.log("User found:", req.user);
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.role = decoded.role; // Store role from token
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};