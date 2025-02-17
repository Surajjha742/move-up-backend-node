const express = require('express');
const {createOrder} = require('../controllers/transportOrderController');
const {verifyToken} = require('../middleware/authMiddleware')

const router = express.Router();

router.post("/createorder", verifyToken, createOrder);


module.exports = router;