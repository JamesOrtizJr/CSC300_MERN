const express = require("express");
const router = express.Router();
const WatchListModel = require("../models/WatchList");

router.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId || "demoUser";

    const {
      movieId,
      movieTitle,
      poster,
      overview,
      release_date,
    } = req.body;

    if (!movieId || !movieTitle) {
      return res.status(400).json({
        message: "movieId and movieTitle are required",
      });
    }

    const movie = await WatchListModel.findOneAndUpdate(
      { userId, movieId },
      {
        userId,
        movieId,
        movieTitle,
        poster,
        overview,
        release_date,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(movie);

  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;