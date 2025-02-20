const TransportOrder = require("../models/transportOrder");
const AllTrucks = require('../models/AllTrucks');


const createOrder = async (req, res) => {
  try {
    let qty_in_tones = 0;
    let qty_in_kiloliter = 0;

    const {
      from,
      to,
      total_road_distence,
      material_name,
      qty,
      vehicle_weight_type,
      vehicle_body_type,
      vehicle_size,
      vehicle_capacity_in_tons,
      vehicle_capacity_in_kiloliter,
      vehicle_category,
      phone_1,
      phone_2,
      order_location, // GeoJSON location object { type: "Point", coordinates: [longitude, latitude] }
      requested_trucks // Array of truck IDs
    } = req.body;

    // Validate user authentication
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Determine quantity based on weight type
    if (vehicle_weight_type === "tons") {
      qty_in_tones = qty;
    } else if (vehicle_weight_type === "kiloliter") {
      qty_in_kiloliter = qty;
    }


    // Create order object
    const order = new TransportOrder({
      user: req.user.id, // Authenticated user ID
      phone_1,
      phone_2,
      from,
      to,
      total_road_distence,
      material_name,
      qty_in_tones,
      qty_in_kiloliter,
      vehicle_weight_type,
      vehicle_body_type,
      vehicle_size,
      vehicle_capacity_in_tons,
      vehicle_capacity_in_kiloliter,
      vehicle_category,
      order_status: "Pending", // Default status
      locationHistory: [], // Initialize empty location history
      accepted_by_driver: null, // No driver assigned yet
      accepted_by_truck: null, // No truck assigned yet
      order_location,
      requested_trucks:null,
      createdAt: Date.now(),
    });

    // Save order to database
    await order.save();

    return res.status(201).json({ 
      message: "Transport order created successfully", 
      "order":order._id,
      "order_location":order.order_location
    });

  } catch (error) {
    return res.status(500).json({ 
      message: "Error creating transport order", 
      error: error.message 
    });
  }
};



// Update Transport Order Location History
const updateTransportLocation = async (req, res) => {
  try {
    const { orderId, latitude, longitude, place_name } = req.body;

    if (!orderId || !latitude || !longitude || !place_name) {
      return res.status(400).json({ error: "Order ID, latitude, longitude, and place name are required." });
    }

    const order = await TransportOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Transport order not found." });
    }

    // Add new location entry to history
    order.locationHistory.push({ latitude, longitude, place_name });

    await order.save();

    res.status(200).json({ message: "Location updated successfully.", locationHistory: order.locationHistory });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const orderExceptedRequestFromUser = async (req, res) => {
  try {
    const { orderId, orderLocationName, maxDistance } = req.body;

    // Fetch the order including `requested_trucks` and `order_location`
    const order = await TransportOrder.findById(orderId)
      .select("requested_trucks order_location");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Extract requested truck IDs
    const requestedTruckIds = order?.requested_trucks || [];

    // Extract order location coordinates
    const [longitude, latitude] = order.order_location.coordinates;

    const nearestTruck = await AllTrucks.findOne({
      _id: { $nin: requestedTruckIds }, truck_status:"searching", // Exclude requested trucks
      truck_location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance, // meters
        },
      },
      is_available: true,
      isTruckApproved: true
    });

    if (!nearestTruck) {
      return res.status(404).json({ message: "No available truck found" });
    }

    res.status(200).json(nearestTruck);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createOrder, updateTransportLocation, orderExceptedRequestFromUser };
// materialname=Iron&
// vehicle_weight_type=tons&
// vehicle_body_type=close_body&
// vehicle_size=gt_50#