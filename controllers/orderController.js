import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['bike', 'bikeName', 'bikeType', 'bikePrice', 
                          'customerName', 'customerPhone', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check for date validity
    if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
      return res.status(400).json({
        message: 'End date must be after start date'
      });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      bike: req.body.bike,
      $or: [
        {
          startDate: { $lt: new Date(req.body.endDate) },
          endDate: { $gt: new Date(req.body.startDate) }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: 'Bike is already booked for the selected dates'
      });
    }

    // Calculate total amount
    const days = Math.ceil(
      (new Date(req.body.endDate) - new Date(req.body.startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = req.body.bikePrice * days;

    // Create new booking
    const booking = await Booking.create({
      ...req.body,
      totalAmount,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: error.message || 'Failed to create booking'
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('bike', 'name image');
      
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be either "confirmed" or "cancelled"'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to update booking status'
    });
  }
};