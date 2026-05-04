const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require("../../../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { movieId, text } = req.body;

    if (!movieId || !text || !text.trim()) {
      return res.status(400).json({
        message: "movieId and text are required.",
      });
    }

    const comment = new Comment({
      movieId,
      text: text.trim(),
      userID: req.user._id,
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("userID", "username")
      .populate("replies.userID", "username");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({
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