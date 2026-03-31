const express = require("express");
const router = express.Router();
const ReviewModel = require("../models/reviews");

// Get all reviews for one user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await ReviewModel.find({ userId }).sort({ createdAt: -1 });

    return res.json({
      userId,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all reviews for a movie
router.get("/:imdbID", async (req, res) => {
  try {
    const { imdbID } = req.params;

    const reviews = await ReviewModel.find({ imdbID }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length === 0
        ? null
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    return res.json({
      imdbID,
      count: reviews.length,
      avgRating,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;