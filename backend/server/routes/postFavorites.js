const express = require("express");
const Favorites = require("../models/favorites");

const router = express.Router();


// POST (ADD FAVORITE)
router.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;

    const {
      movieId,
      title,
      name,
      overview,
      poster_path,
      release_date
    } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: "userId and movieId are required" });
    }

    // prevents duplicates + updates if exists
    const favorite = await Favorites.findOneAndUpdate(
      { userId, movieId },
      {
        userId,
        movieId,
        title,
        name,
        overview,
        poster_path,
        release_date,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(favorite);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// REMOVE FAVORITE
router.delete("/:movieId", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const deleted = await Favorites.findOneAndDelete({
      userId,
      movieId: req.params.movieId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.status(200).json({ message: "Removed" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;