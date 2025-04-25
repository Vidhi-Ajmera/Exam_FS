// backend/controllers/commentController.js
const Comment = require("../models/Comment");
const Video = require("../models/Video");

// Get comments for a video
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username avatar")
      .sort({ timestamp: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      text,
    });

    // Populate user data for response
    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar"
    );

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await comment.remove();

    res.json({ message: "Comment removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
