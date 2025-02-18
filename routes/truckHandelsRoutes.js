const express = require('express');
const upload = require('../middleware/multer');
const {addTruck} = require('../controllers/truckHandelController')
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware')
const { assignTruckToDriver } = require("../controllers/truckAssignmentController");



const router = express.Router();

router.post("/addtruck",verifyToken, authorizeRoles(["admin", "driver", "partner", "staff"]), upload.fields([{ name: "truck_image", maxCount: 1 }, { name: "truck_documents", maxCount: 5 }]), addTruck);

router.post("/assign-truck", authorizeRoles(["admin", "driver", "partner", "staff"]), assignTruckToDriver);

module.exports = router;