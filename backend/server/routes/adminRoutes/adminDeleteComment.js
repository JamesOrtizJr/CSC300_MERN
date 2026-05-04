const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require("../../../middleware/auth");

router.delete("/:commentId", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      message: "Comment deleted by admin.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not delete comment.",
      error: err.message,
    });
  }
});

router.delete("/:commentId/reply/:replyId", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    const reply = comment.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        message: "Reply not found.",
      });
    }

    comment.replies.pull(req.params.replyId);
    await comment.save();

    res.status(200).json({
      message: "Reply deleted by admin.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not delete reply.",
      error: err.message,
    });
  }
});

module.exports = router;