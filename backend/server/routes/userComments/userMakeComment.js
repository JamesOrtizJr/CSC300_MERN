const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");

router.post("/", async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, text, userId, username } = req.body;

    if (!movieId || !text || !text.trim() || !userId || !username) {
      return res.status(400).json({
        message: "movieId, text, userId, and username are required.",
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
    res.status(500).json({
      message: "Could not create comment.",
      error: err.message,
    });
  }
});

module.exports = router;