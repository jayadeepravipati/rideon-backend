import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: [true, 'Bike reference is required']
  },
  bikeName: { type: String, required: [true, 'Bike name is required'] },
  bikeType: { type: String, required: [true, 'Bike type is required'] },
  bikePrice: { type: Number, required: [true, 'Price is required'], min: 0 },
  bikeLocation: { type: String, required: [true, 'Location is required'] },
  customerName: { type: String, required: [true, 'Customer name is required'] },
  customerPhone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'],
    index: true
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  bookingDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add index to prevent overlapping bookings
bookingSchema.index(
  { bike: 1, startDate: 1, endDate: 1 },
  { unique: true }
);

export default mongoose.model('Booking', bookingSchema);