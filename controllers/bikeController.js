import Bike from "../models/Bike.js";

// Get all bikes (without image data for performance)
export const getBikes = async (req, res) => {
  try {
    const bikes = await Bike.find().select("-image.data");
    res.status(200).json(bikes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bikes", error: error.message });
  }
};

// Get bike with image data
export const getBikeWithImage = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      console.log('Bike not found:', req.params.id);
      return res.status(404).json({ message: "Bike not found" });
    }
    
    const responseData = {
      ...bike._doc,
      image: bike.image ? {
        contentType: bike.image.contentType,
        data: bike.image.data.toString('base64').slice(0, 20) + '...' // Log partial data
      } : null
    };
    
    console.log('Returning bike data:', {
      id: responseData._id,
      hasImage: !!responseData.image
    });
    
    res.status(200).json({
      ...bike._doc,
      image: bike.image ? {
        contentType: bike.image.contentType,
        data: bike.image.data.toString('base64')
      } : null
    });
  } catch (error) {
    console.error('Error in getBikeWithImage:', error);
    res.status(500).json({ message: "Error fetching bike", error: error.message });
  }
};

// Add new bike with image
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
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    res.status(201).json({
      _id: newBike._id,
      name: newBike.name,
      type: newBike.type,
      pricePerDay: newBike.pricePerDay,
      location: newBike.location,
      imageUrl: `/api/bikes/${newBike._id}/image`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete bike
export const deleteBike = async (req, res) => {
  try {
    await Bike.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bike", error: error.message });
  }
};
