const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");

router.get("/movie/:movieId", async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .populate("userID", "username")
      .populate("replies.userID", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Could not fetch comments.",
      error: err.message,
    });
  }
});

router.get("/user/:userID", async (req, res) => {
  try {
    const comments = await Comment.find({ userID: req.params.userID })
      .populate("userID", "username")
      .populate("replies.userID", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Could not fetch user comments.",
      error: err.message,
    });
  }
});

module.exports = router;