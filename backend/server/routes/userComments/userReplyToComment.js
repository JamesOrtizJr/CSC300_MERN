const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require("../../../middleware/auth");

router.post("/:commentId/reply", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Reply text is required.",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    comment.replies.push({
      userID: req.user._id,
      text: text.trim(),
    });

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("userID", "username")
      .populate("replies.userID", "username");

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({
      message: "Could not reply to comment.",
      error: err.message,
    });
  }
});

module.exports = router;