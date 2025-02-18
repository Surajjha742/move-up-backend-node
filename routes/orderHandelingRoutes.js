const express = require('express');
const {createOrder, updateTransportLocation} = require('../controllers/transportOrderController');
const {verifyToken} = require('../middleware/authMiddleware')

const router = express.Router();

router.post("/createorder", verifyToken, createOrder);
router.post("/update-transport-location", verifyToken, updateTransportLocation);


module.exports = router;