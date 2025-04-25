const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const auth = require("../middleware/auth");

// Get all videos
router.get("/", videoController.getVideos);

// Get video by ID
router.get("/:id", videoController.getVideoById);

// Create a new video (protected route)
router.post("/", auth, videoController.createVideo);

module.exports = router;
