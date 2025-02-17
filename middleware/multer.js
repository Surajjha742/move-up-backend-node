const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save images in uploads/trucks folder
    },
    filename:function (req, file, cb){
        cb(null, file.originalname+"-"+Date.now()+path.extname(file.originalname))
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
      cb(null, true);
  } else {
      cb(new Error("Only image files are allowed"), false);
  }
};

  
const upload = multer({
    storage:storage,
    limits:{fileSize:2*1024*1024}, // 2MB limit
    fileFilter:fileFilter
});

module.exports = upload;