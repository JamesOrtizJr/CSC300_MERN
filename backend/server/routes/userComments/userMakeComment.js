const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require('../../../middleware/auth');

router.post("/", auth, async (req, res) => {
  try {
    const { movieId, text } = req.body;

    if (!movieId || !text || !text.trim()) {
      return res.status(400).json({
        message: "movieId and text are required.",
      });
    }

    const comment = new Comment({
      userId: req.user._id,
      movieId,
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

module.exports = router;