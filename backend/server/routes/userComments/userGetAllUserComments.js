const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");

router.get("/movie/:movieId", async (req, res) => {
  try {
    const comments = await Comment.find({
      movieId: req.params.movieId,
    }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({
      message: "Could not fetch comments.",
      error: err.message,
    });
  }
  
});
router.get("/user/:userId", async (req, res) => {
  try {
    const comments = await Comment.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching user comments:", err);
    res.status(500).json({
      message: "Could not fetch user comments.",
      error: err.message,
    });
  }
});

module.exports = router;