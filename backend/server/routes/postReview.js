const express = require("express");
const router = express.Router();
const ReviewModel = require("../models/reviews");

// postReviews: Sam Parker
// Create a review for a movie
router.post("/:imdbID", async (req, res) => {
  try {
    const { imdbID } = req.params;
    const { rating, comment } = req.body;

    // Temporary user id (until you have auth)
    const userId = req.headers["x-user-id"] || "demoUser";

    if (rating == null) {
      return res.status(400).json({ message: "rating required" });
    }

    const created = await ReviewModel.create({
      imdbID,
      userId,
      rating,
      // comment is optional here; include if you want it
      comment: comment || ""
    });

    return res.status(201).json(created);
  } catch (err) {
    // duplicate review (same user + same imdbID)
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this movie" });
    }
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;