const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate Access Token
const generateAccessToken = (user)=>{
    return jwt.sign({id:user._id, role:user.role, password:user.password, isAccountApproved:user.isAccountApproved}, process.env.JWT_SECRET, {expiresIn:"1d"});
}

// Generate Refresh Token
const generateRefreshToken = (user)=>{
    return jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"7d"});
}


const createUser = async (req, res) => {
    try {
        const {
            fullName,
            username,
            email,
            password,
            phone,
            whatsappNumber,
            role = "user",
            aadharCardNumber,
            panCardNumber,
            location,
            currentTruckId,
            currentTruckNumber,
            owner
        } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Handle file uploads (stored in req.files)
        const profilePhoto = req.files?.profilePhoto ? req.files.profilePhoto[0].path : null;
        const aadharCardPhoto = req.files?.aadharCardPhoto ? req.files.aadharCardPhoto[0].path : null;
        const panCardPhoto = req.files?.panCardPhoto ? req.files.panCardPhoto[0].path : null;

        // Validate required fields for specific roles
        if (["driver", "partner", "staff"].includes(role)) {
            if (!aadharCardNumber || !aadharCardPhoto || !panCardNumber || !panCardPhoto) {
                return res.status(400).json({ message: "Aadhar Card & PAN Card details are required for this role." });
            }
        }

    
        if (role === "partner" && !owner) {
            return res.status(400).json({ message: "Owner ID is required for partners." });
        }

        
        // Create new user object
        const user = new User({
            fullName,
            username,
            email,
            password: password,
            phone,
            whatsappNumber,
            role,
            profilePhoto,
            aadharCardNumber,
            aadharCardPhoto,
            panCardNumber,
            panCardPhoto,
            location: location ? JSON.parse(location) : undefined, // Parse location if provided
            currentTruckId,
            currentTruckNumber,
            owner
        });

        await user.save();
        return res.status(201).json({ message: "User created successfully.", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error });
    }
};



const loginUser = async (req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const AccessToken = generateAccessToken(user);
    const RefreshToken = generateRefreshToken(user);
    
    return res.status(200).json({message:"Login successful", AccessToken, RefreshToken})
}



const fetchProfile = async (req, res) => {
    try {
        // Extract user ID from the token (Middleware should verify the token)
        const userId = req.user.id;

        // Fetch user details, excluding the password
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};


module.exports = {createUser, loginUser, fetchProfile};