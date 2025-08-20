const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'userProfilePic',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
})

const upload = multer({storage});

router.post('/user-profile-pic', upload.single('image'), async (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    return res.json({ secure_url: req.file.path || req.file.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "userResumes",
    resource_type: "raw", // 👈 needed for non-image files
    allowed_formats: ["pdf"], // only allow pdf
  },
});
const uploadResume = multer({ storage: resumeStorage });

router.post("/upload-resume", uploadResume.single("resume"), async (req, res) => {
  try {
    console.log("Resume Uploaded:", req.file);
    return res.json({ secure_url: req.file.path || req.file.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Resume upload failed", error: err.message });
  }
});






module.exports = router;