const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate Access Token
const generateAccessToken = (user)=>{
    console.log(user.isAccountApproved)
    return jwt.sign({id:user._id, role:user.role, password:user.password, isAccountApproved:user.isAccountApproved}, process.env.JWT_SECRET, {expiresIn:"1d"});
}

// Generate Refresh Token
const generateRefreshToken = (user)=>{
    return jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"7d"});
}


const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message:"User already exists"});
        }


        const user = new User({ username, email, password, role:role || "user" });
        await user.save();
        return res.status(201).json({message:"User created successfully.",user});
    }
    catch (error) {
        res.status(400).json({ message: "Invalid User data"});
    }
}


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

module.exports = {createUser, loginUser};