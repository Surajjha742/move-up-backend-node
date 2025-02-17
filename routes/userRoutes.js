const express = require('express');
const {createUser, loginUser} = require('../controllers/userController');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, (req, res)=>{
    return res.status(200).json({message:"Profile", user:req.user})
})

module.exports = router;