const AllTrucks = require('../models/AllTrucks');

const addTruck = async (req, res) => {
    try {
        const { truck_number, truck_type, truck_capacity_in_tons, truck_capacity_in_kiloliter, truck_weight_type, truck_body_type, owner_name, owner_phone, latitude, longitude, start_longitude, start_latitude } = req.body;
        // Check if file is uploaded
        // const truck_image = req.file ? `/uploads/${req.file.filename}` : "";
        // Handling truck image upload

        const truck_location = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)] // [longitude, latitude]
        };
        console.log(truck_location)

        // ✅ Fix: Ensure start_location has default coordinates
        const start_location = start_latitude && start_longitude
            ? { type: "Point", coordinates: [parseFloat(start_longitude), parseFloat(start_latitude)] }
            : { type: "Point", coordinates: [0, 0] }; // Set a default if missing

        // ✅ Ensure other location arrays have proper structure
        const route_stops = [];
        const delivery_locations = [];

        const truck_image = req.files["truck_image"] ? req.files["truck_image"][0].path : null;

        // Handling truck documents
        let truck_documents = [];
        if (req.files["truck_documents"]) {
            truck_documents = req.files["truck_documents"].map((file) => ({
                document_type: req.body.document_type, // Get document type from request
                document_number: req.body.document_number, // Get document number
                document_photo: file.path
            }));
        }


        const truck = new AllTrucks({ truck_number, truck_type, truck_capacity_in_tons, truck_capacity_in_kiloliter, truck_weight_type, truck_body_type, owner_name, owner_phone, user: req.user.id, truck_image, truck_documents, truck_location, route_stops, delivery_locations, start_location });
        await truck.save();
        return res.status(200).json({ message: "Truck successfully added.", data: truck })
    }
    catch (error) {
        return res.status(500).json({ message: "Invalid request or truck already Registered", error });
    }
}

const findNearestTrucks = async (req, res) => {
    // console.log("Calling")
    try {
        let { longitude, latitude, maxDistance = 5000 } = req.body; // Default 5km

        
        // Validate inputs
        if (typeof longitude !== "number" || typeof latitude !== "number") {
            return res.status(400).json({ success: false, message: "Longitude and Latitude must be valid numbers." });
        }

        // Convert to float (in case strings are received)
        longitude = parseFloat(longitude);
        latitude = parseFloat(latitude);

        const trucks = await AllTrucks.find({
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
        }).limit(100);

        res.status(200).json({ success: true, data: trucks });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};




module.exports = { addTruck, findNearestTrucks };