const TransportOrder = require("../models/transportOrder");

const createOrder = async (req, res) => {
    try {
        let qty_in_tones;
        let qty_in_kiloliter;
        const { from, to, material_name, qty, vehicle_weight_type, vehicle_body_type, vehicle_size, phone_1, phone_2 } = req.body;
        
        if (vehicle_weight_type == "tons") {
            qty_in_tones = qty;
            qty_in_kiloliter = 0;
        } else if (vehicle_weight_type == "kiloliter") {
            qty_in_kiloliter = qty;
            qty_in_tones = 0;
        }
        
        if(!req.user){
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        console.log(req.user.id)
        
        const order = new TransportOrder({from, to, material_name, vehicle_weight_type, qty_in_tones, qty_in_kiloliter, vehicle_body_type, vehicle_size, user:req.user.id, phone_1, phone_2});
        await order.save();
        return res.status(200).json({message:"Order successfully created", order:order})
    }
    catch (error) {

        return res.status(400).json({ message: "error", error });
    }
}


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

module.exports = {createOrder, updateTransportLocation};
// materialname=Iron&
// vehicle_weight_type=tons&
// vehicle_body_type=close_body&
// vehicle_size=gt_50#