const express = require("express");
const router = express.Router();
const Comment = require("../../models/userComment");
const auth = require("../../../middleware/auth");

router.delete("/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    if (String(comment.userID) !== String(req.user._id)) {
      return res.status(403).json({
        message: "You can only delete your own comments.",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      message: "Comment deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not delete comment.",
      error: err.message,
    });
  }
});

module.exports = router;