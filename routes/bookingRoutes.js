// const express = require("express");
// const Booking = require("../models/Booking");
// const Bike = require("../models/Bike");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Book a bike
// router.post("/book", protect, async (req, res) => {
//   try {
//     const { bikeId, startDate, endDate, totalPrice } = req.body;
//     const booking = new Booking({ user: req.user.id, bike: bikeId, startDate, endDate, totalPrice });
//     await booking.save();

//     // Mark the bike as unavailable
//     await Bike.findByIdAndUpdate(bikeId, { available: false });

//     res.status(201).json({ message: "Bike booked successfully", booking });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get user bookings
// router.get("/my-bookings", protect, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user.id }).populate("bike");
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Cancel a booking
// router.delete("/cancel/:id", protect, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // Mark the bike as available again
//     await Bike.findByIdAndUpdate(booking.bike, { available: true });

//     await booking.remove();
//     res.json({ message: "Booking cancelled successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
// routes/bookingRoutes.js
import express from 'express';
import { 
  createBooking, 
  getBookings,
  updateBookingStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.patch('/:id/status', updateBookingStatus);

export default router;