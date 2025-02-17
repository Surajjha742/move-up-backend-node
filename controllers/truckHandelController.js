const AllTrucks = require('../models/AllTrucks');

const addTruck = async (req, res) => {
    try {
        const { truck_number, truck_type, truck_capacity_in_tons, truck_capacity_in_kiloliter, truck_weight_type, truck_body_type, owner_name, owner_phone, latitude, longitude } = req.body;
        // Check if file is uploaded
        // const truck_image = req.file ? `/uploads/${req.file.filename}` : "";
        // Handling truck image upload
        let truck_location = {};
        truck_location.latitude = latitude;
        truck_location.longitude = longitude;
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

        const truck = new AllTrucks({ truck_number, truck_type, truck_capacity_in_tons, truck_capacity_in_kiloliter, truck_weight_type, truck_body_type, owner_name, owner_phone, user: req.user.id, truck_image, truck_documents, truck_location });
        await truck.save();
        return res.status(200).json({ message: "Truck successfully added.", data: truck })
    }
    catch (error) {
        return res.status(500).json({ message: "Invalid request or truck already Register" });
    }
}


module.exports = { addTruck };