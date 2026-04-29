const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require("../../../middleware/auth");

router.put("/:commentId", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required.",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    if (String(comment.userID) !== String(req.user._id)) {
      return res.status(403).json({
        message: "You can only edit your own comments.",
      });
    }

    comment.text = text.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("userID", "username")
      .populate("replies.userID", "username");

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({
      message: "Could not edit comment.",
      error: err.message,
    });
  }
});

module.exports = router;