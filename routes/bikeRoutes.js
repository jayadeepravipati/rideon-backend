// import express from "express";
// import { getBikes, addBike, deleteBike } from "../controllers/bikeController.js"; 
// import { protect, adminOnly } from "../middleware/authMiddleware.js";
// import upload from "../config/multerConfig.js";
// const router = express.Router();

// router.get("/", getBikes); // Public route: Get all bikes
// router.post("/", protect, adminOnly, addBike); // Only admin can add bikes
// router.delete("/:id", protect, adminOnly, deleteBike); // Only admin can delete bikes

// export default router;
import express from "express";
import { 
  getBikes, 
  addBike, 
  deleteBike,
  getBikeWithImage  // Add this new controller
} from "../controllers/bikeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

// Public routes
router.get("/", getBikes); // Get all bikes
router.get("/:id/full", getBikeWithImage); // New endpoint for bike with image

// Protected admin routes
router.post(
  "/", 
  protect, 
  adminOnly, 
  upload.single("image"), // Multer middleware for single image upload
  addBike
);

router.delete("/:id", protect, adminOnly, deleteBike);

export default router;