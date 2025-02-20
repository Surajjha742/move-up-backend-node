const express = require('express');
const {createOrder, updateTransportLocation, orderExceptedRequestFromUser} = require('../controllers/transportOrderController');
const {verifyToken} = require('../middleware/authMiddleware')

const router = express.Router();

router.post("/createorder", verifyToken, createOrder);
router.post("/update-transport-location", verifyToken, updateTransportLocation);
router.post("/order-except-request-from-user", verifyToken, orderExceptedRequestFromUser);


module.exports = router;