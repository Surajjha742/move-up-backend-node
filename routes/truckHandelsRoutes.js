const express = require('express');
const upload = require('../middleware/multer');
const {addTruck} = require('../controllers/truckHandelController')
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware')

const router = express.Router();

router.post("/addtruck",verifyToken, authorizeRoles(["admin", "driver", "partner", "staff"]), upload.fields([{ name: "truck_image", maxCount: 1 }, { name: "truck_documents", maxCount: 5 }]), addTruck);

module.exports = router;