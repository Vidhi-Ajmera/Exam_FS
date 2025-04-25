const Video = require("../models/Video");
const Channel = require("../models/Channel");

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Handle search
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Handle category filter
    if (category) {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate("channel", "name thumbnailUrl")
      .populate("uploader", "username avatar")
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "name thumbnailUrl subscribers")
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, channelId, category } =
      req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Verify channel belongs to user
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channel: channelId,
      uploader: req.user._id,
      category,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
