const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/auth");

// Get comments for a video
router.get("/:videoId", commentController.getComments);

// Add a comment (protected route)
router.post("/:videoId", auth, commentController.addComment);

// Update a comment (protected route)
router.put("/:commentId", auth, commentController.updateComment);

// Delete a comment (protected route)
router.delete("/:commentId", auth, commentController.deleteComment);

module.exports = router;
