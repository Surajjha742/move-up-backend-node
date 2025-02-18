const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    profilePhoto: {
        type: String, // File path or URL (optional for all users)
        trim: true,
    },
    fullName: {
        type: String,
        trim: true, // Optional Full Name
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        trim: true, // Optional Phone Number
    },
    whatsappNumber: {
        type: String,
        trim: true, // Optional WhatsApp Number
    },
    role: {
        type: String,
        enum: ["user", "admin", "driver", "partner", "staff"],
        required: true,
        default: "user"
    },
    isAccountApproved: {
        type: Boolean,
        default: function () {
            return this.role === "user"; // true for "user", false for others
        },
    },
    // Identity Documents (Required only for "driver", "partner", "staff")
    aadharCardNumber: {
        type: String,
        required: function () {
            return ["driver", "partner", "staff"].includes(this.role);
        },
        trim: true,
    },
    aadharCardPhoto: {
        type: String, // Will store file path
        required: function () {
            return ["driver", "partner", "staff"].includes(this.role);
        },
    },
    panCardNumber: {
        type: String,
        required: function () {
            return ["driver", "partner", "staff"].includes(this.role);
        },
        trim: true,
    },
    panCardPhoto: {
        type: String, // Will store file path
        required: function () {
            return ["driver", "partner", "staff"].includes(this.role);
        },
    },
    // 📍 Location Field: User Location
    location: {
        latitude: {
            type: Number,
            required: false, // Not mandatory
        },
        longitude: {
            type: Number,
            required: false, // Not mandatory
        },
    },
    // 🚛 Current Truck Details (For Drivers Only)
    currentTruckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck", // Reference to the Truck model
        required: function () {
            return this.role === "driver";
        },
    },
    currentTruckNumber: {
        type: String, // Truck registration number
        trim: true,
        required: function () {
            return this.role === "driver";
        },
    },
    // 🏠 Owner (For Truck Owners or Partners)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the owner of the truck
        required: function () {
            return this.role === "partner"; // Only required for partners
        },
    }
},
    { timestamps: true }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})



module.exports = mongoose.model("User", userSchema);