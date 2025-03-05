const AllTrucks = require('./models/AllTrucks');
const TransportOrder = require("./models/transportOrder");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ Client Connected: ${socket.id}`);

    // listen for truck room by truckid
    socket.on("join_truckroom", (truckId)=>{
      socket.join(truckId);
      console.log("Joined truck:"+truckId);
    })
    
    // ✅ Listen for Order Updates
    socket.on("join_order", (orderId) => {
      socket.join(orderId);
      console.log(`📌 Joined Order Room: ${orderId}`);
    });

    // ✅ Handle message
    socket.on("message", async ({ orderId, messageData }) => {
      console.log("Receved message")
      console.log(orderId, messageData)
      try {
        io.to(orderId).emit("messaged", {message:"This is message", orderId, messageData });
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    });
    
    // ✅ Handle Location Updates
    socket.on("update_location", async ({ orderId, coordinates }) => {
      try {
        await TransportOrder.findByIdAndUpdate(orderId, { "order_location.coordinates": coordinates });
        io.to(orderId).emit("location_updated", { orderId, coordinates });
      } catch (error) {
        console.error("❌ Error Updating Location:", error);
      }
    });

    // ✅ Handle Status Updates
    socket.on("update_status", async ({ orderId, status }) => {
      try {
        await TransportOrder.findByIdAndUpdate(orderId, { order_status: status });
        io.to(orderId).emit("status_updated", { orderId, status });
      } catch (error) {
        console.error("❌ Error Updating Status:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client Disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
