const express = require("express");
const router = express.Router();
const Favorites = require("../models/favorites");

router.get("/", async (req, res) => {
  try {
    const favorites = await Favorites.find().sort({ _id: -1 });
    return res.json(favorites);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//DELETE FAVORITE
router.delete("/:movieId", async (req, res) => {
  try {
    const deleted = await Favorites.findOneAndDelete({
      movieId: req.params.movieId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.status(200).json({ message: "Favorite removed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;