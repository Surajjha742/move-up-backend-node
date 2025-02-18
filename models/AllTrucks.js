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
  isAccountApproved: {
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
  
  // 📍 Location Field: Truck Location
  truck_location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },


  // 🏁 Start Location (Boarding Point)
  start_location: {
    place_name: {
      type: String,
      required: false,
      trim: true
    },
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    }
  },
  // ⏸️ Stops Along the Route
  route_stops: [
    {
      place_name: {
        type: String,
        required: true,
        trim: true
      },
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  ],
  // 🎯 Delivery Locations
  delivery_locations: [
    {
      place_name: {
        type: String,
        required: true,
        trim: true
      },
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

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