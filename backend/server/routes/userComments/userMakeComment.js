const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require('../../../middleware/auth');

router.post("/", async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, text, userId, username } = req.body;

    if (!movieId || !movieTitle || !userId || !username) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const comment = new Comment({
      userId,
      username,
      movieId,
      movieTitle,
      moviePoster,
      text: text.trim(),
    
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(400).json({
      message: "Could not create comment.",
      error: err.message,
    });
  }
});

router.delete("/:commentId", async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.commentId);

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;