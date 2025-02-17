const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." })
    }

    try {
        // token jwt.verify
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(403).json({ message: "Invalid token" });
    }

}

const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role) || req.user.isAccountApproved==false) {
            return res.status(403).json({ message: "Access denied. Unauthorized role and permition." })
        }
        next();
    }
}


module.exports = { verifyToken, authorizeRoles };

