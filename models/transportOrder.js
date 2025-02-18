const mongoose = require("mongoose")


const transportOrderSchema = new mongoose.Schema({
  phone_1: {
    type: String,
    required: true,
    trim: true
  },
  phone_2: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  total_road_distence: {
    type: Number,
    min: 0
  },
  material_name: {
    type: String,
    required: true,
    trim: true
  },
  vehicle_size: {
    type: String,
    required: true,
    trim: true
  },
  qty_in_tones: {
    type: Number,
    required: true,
    min: 0
  },
  qty_in_kiloliter: {
    type: Number,
    required: true,
    min: 0
  },
  vehicle_body_type: {
    type: String,
    enum: ["close_body", "open_body", "flatbed", "container"], // Allowed vehicle types
    required: true
  },
  vehicle_capacity_in_tons: {
    type: Number,
    min: 0
  },
  vehicle_capacity_in_kiloliter: {
    type: Number,
    min: 0
  },
  vehicle_weight_type: {
    type: String,
    enum: ["tons", "kiloliter"], // Defines weight measurement type
    required: true
  },
  vehicle_category: {
    type: String,
    enum: ["Trailer", "Truck", "Tanker", "Container"],
  },
  order_status: {
    type: String,
    enum: ["waiting for except", "processing someone", "Pending", "In Transit", "Delivered", "Cancelled"],
    default: "Pending"
  },
  // 📍 New: Location History (with place name)
  locationHistory: [
    {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      place_name: {
        type: String,
        required: true,
        trim: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // ✅ New: Accepted Order by Driver
  accepted_by_driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the driver who accepted the order
    default: null
  },

  // ✅ New: Accepted Order by Truck
  accepted_by_truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AllTrucks", // Reference to the truck assigned to the order
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


const TransportOrder = mongoose.model('TransportOrder', transportOrderSchema);

module.exports = TransportOrder;