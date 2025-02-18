const User = require("../models/User"); // User model
const Truck = require("../models/AllTrucks"); // Truck model (assuming it exists)
const mongoose = require("mongoose");

// Assign a truck to a driver
exports.assignTruckToDriver = async (req, res) => {
    try {
        const { driverId, truckId } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(driverId) || !mongoose.Types.ObjectId.isValid(truckId)) {
            return res.status(400).json({ message: "Invalid driver or truck ID" });
        }

        // Check if driver exists
        const driver = await User.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Ensure the user is a driver
        if (driver.role !== "driver") {
            return res.status(400).json({ message: "User is not a driver" });
        }

        // Check if truck exists
        const truck = await Truck.findById(truckId);
        if (!truck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        // Ensure the truck is not already assigned to another driver
        const existingDriver = await User.findOne({ currentTruckId: truckId });
        if (existingDriver) {
            return res.status(400).json({ message: "Truck is already assigned to another driver" });
        }

        // Assign truck to the driver
        driver.currentTruckId = truckId;
        driver.currentTruckNumber = truck.truckNumber; // Assuming truck has a truckNumber field

        await driver.save();

        res.status(200).json({ message: "Truck assigned successfully", driver });
    } catch (error) {
        console.error("Error assigning truck:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
