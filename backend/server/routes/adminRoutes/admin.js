const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
// BAN USER
router.put("/ban/:userId", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { isBanned: true },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: `User ${updatedUser.username} has been banned.`,
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Error banning user", error: error.message });
    }
        

});

// UNBAN USER
router.put("/unban/:userId", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { isBanned: false },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: `User ${updatedUser.username} has been unbanned.`,
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Error unbanning user", error: error.message });
    }
});

//STATS
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });

    res.json({
      totalUsers,
      bannedUsers
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting stats" });
  }
});

//MAKEADMIN
router.put("/make-admin/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${updatedUser.username} is now an admin.`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Error making admin", error: error.message });
  }
});

router.put("/remove-admin/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${updatedUser.username} is no longer an admin.`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing admin", error: error.message });
  }
});

module.exports = router;
