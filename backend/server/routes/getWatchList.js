const express = require("express");
const router = express.Router();
const WatchListModel = require("../models/WatchList");

router.get("/", async (req, res) => {
  try {
    
    const userId = req.headers["x-user-id"] || "demoUser";

    const movies = await WatchListModel.find({ userId });

    return res.status(200).json(movies);

  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Optional: Add DELETE route to remove from watchlist
router.delete("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.headers["x-user-id"] || "demoUser";

    const deleted = await WatchListModel.findOneAndDelete({ 
      userId, 
      movieId 
    });

    if (!deleted) {
      return res.status(404).json({ 
        message: "Movie not found in watchlist" 
      });
    }

    return res.status(200).json({ 
      message: "Movie removed from watchlist" 
    });

  } catch (err) {
    console.error("Error removing from watchlist:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;