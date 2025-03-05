const express = require('express');
const http = require("http");
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const orderhandelingRoutes = require('./routes/orderHandelingRoutes');
const truckHandelRoutes = require('./routes/truckHandelsRoutes');
const setupSocket = require("./socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());

app.use('/uploads', express.static('uploads'));
// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

// Routes
app.use("/auth", userRoutes);
app.use("/order", orderhandelingRoutes);
app.use("/truck", truckHandelRoutes);


setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT} ==> url: http://127.0.0.1:${PORT}/`);
});