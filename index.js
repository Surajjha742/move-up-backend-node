const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const orderhandelingRoutes = require('./routes/orderHandelingRoutes');
const truckHandelRoutes = require('./routes/truckHandelsRoutes');

dotenv.config();
connectDB();

const app = express();

app.use('/uploads', express.static('uploads'));
// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

// Routes
app.use("/auth", userRoutes);
app.use("/order", orderhandelingRoutes);
app.use("/truck", truckHandelRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT} ==> url: http://127.0.0.1:${PORT}/`);
})