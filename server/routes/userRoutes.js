const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

console.log("✅ userRoutes.js loaded");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("User route is working!");
});

// =========================
// ADD USER
// =========================
router.post("/add", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check required fields
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Check empty values
    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({
        error: "Name and email cannot be empty",
      });
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email: trimmedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
    });

    res.status(201).json(user);

  } catch (err) {
    console.error("ADD USER ERROR:", err);

    res.status(500).json({
      error: "Server error while adding user",
    });
  }
});

// =========================
// GET ALL USERS
// =========================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    res.json(users);

  } catch (err) {
    console.error("GET USERS ERROR:", err);

    res.status(500).json({
      error: "Server error while getting users",
    });
  }
});

// =========================
// UPDATE USER
// =========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // Check required fields
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Check empty values
    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({
        error: "Name and email cannot be empty",
      });
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    // Check if email belongs to another user
    const existingUser = await User.findOne({
      email: trimmedEmail,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: trimmedName,
        email: trimmedEmail,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);

    res.status(500).json({
      error: "Server error while updating user",
    });
  }
});

// =========================
// DELETE USER
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
      deletedUser,
    });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);

    res.status(500).json({
      error: "Server error while deleting user",
    });
  }
});

module.exports = router;