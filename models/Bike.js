// import mongoose from "mongoose";

// const bikeSchema = new mongoose.Schema({
//     name: String,
//     type: String,
//     pricePerDay: Number,
//     location: String,
// });

// export default mongoose.model("Bike", bikeSchema);
import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Bike name is required"] 
  },
  type: { 
    type: String, 
    required: [true, "Bike type is required"] 
  },
  pricePerDay: { 
    type: Number, 
    required: [true, "Price per day is required"],
    min: [0, "Price cannot be negative"]
  },
  location: { 
    type: String, 
    required: [true, "Location is required"] 
  },
  image: {
    data: Buffer,       // Binary data of the image
    contentType: String // MIME type (e.g., 'image/jpeg', 'image/png')
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Bike", bikeSchema);