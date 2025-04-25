// backend/routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Register a new user
router.post("/register", userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Get user profile
router.get("/profile", auth, userController.getUserProfile);

module.exports = router;
