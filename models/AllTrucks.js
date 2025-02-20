const mongoose = require('mongoose');

const AllTrucksSchema = mongoose.Schema({
  truck_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  truck_image: {
    type: String, // Store image URL or file path
    required: false
  },
  truck_type: {
    type: String,
    enum: ["Trailer", "Truck", "Tanker", "Container"],
    required: true
  },
  truck_capacity_in_tons: {
    type: Number,
    min: 0,
    required: true
  },
  truck_capacity_in_kiloliter: {
    type: Number,
    min: 0,
    required: true
  },
  truck_weight_type: {
    type: String,
    enum: ["tons", "kiloliter"],
    required: true
  },
  truck_body_type: {
    type: String,
    enum: ["close_body", "open_body", "flatbed", "container"],
    required: true
  },
  owner_name: {
    type: String,
    required: true,
    trim: true
  },

  truck_status:{
    type:String,
    enum:["searching", "proccessing", "running", ""],
    required:false,
    trim:true,
    default:""
  },

  owner_phone: {
    type: String,
    required: true,
    trim: true
  },
  is_available: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  isTruckApproved: {
    type: Boolean,
    default: false
  },
  // New Field: Truck Documents
  truck_documents: [
    {
      document_type: {
        type: String,
        enum: ["RC", "Insurance", "Pollution", "Fitness Certificate", "Permit"],
        required: true
      },
      document_number: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      document_photo: {
        type: String, // Store file path or URL
        required: true
      }
    }
  ],

  assigned_driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the driver who is assigned
    default: null // Null when truck is not assigned
  },

  // 📍 Truck's Current Location (GeoJSON)
  truck_location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  // 🏁 Start Location (Boarding Point) - GeoJSON
  start_location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
    place_name: {
      type: String,
      required: false,
      trim: true,
    },
  },

  // ⏸️ Stops Along the Route (GeoJSON)
  route_stops: [
    {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
      place_name: {
        type: String,
        required: false,
        trim: true,
      },
    },
  ],

  // 🎯 Delivery Locations (GeoJSON)
  delivery_locations: [
    {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
      place_name: {
        type: String,
        required: false,
        trim: true,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// ✅ Create geospatial index on all location fields
AllTrucksSchema.index({ truck_location: "2dsphere" });
AllTrucksSchema.index({ start_location: "2dsphere" });
AllTrucksSchema.index({ route_stops: "2dsphere" });
AllTrucksSchema.index({ delivery_locations: "2dsphere" });

// 🚛 Middleware: Ensure truck availability before assigning
AllTrucksSchema.pre("save", function (next) {
  if (this.assigned_driver) {
    this.is_available = false; // Mark as unavailable when assigned
  } else {
    this.is_available = true; // Mark as available when unassigned
  }
  next();
});

const AllTrucks = mongoose.model("AllTrucks", AllTrucksSchema);

module.exports = AllTrucks;