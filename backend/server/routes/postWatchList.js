const express = require("express");
const router = express.Router();
const WatchListModel = require("../models/WatchList");

router.post("/", async (req, res) => {
  try {
    // Get all data from request body
    const { movieId, movieTitle, poster } = req.body;
    
    // Temporary user id (until auth is implemented)
    const userId = req.headers["x-user-id"] || "demoUser";

    
    if (!movieId || !movieTitle) {
      return res.status(400).json({ 
        message: "movieId and movieTitle are required" 
      });
    }

    // Check if already exists
    const existing = await WatchListModel.findOne({ userId, movieId });
    if (existing) {
      return res.status(409).json({ 
        message: "Movie already in watchlist" 
      });
    }

    // Create new watchlist entry
    const created = await WatchListModel.create({
      userId,
      movieId,
      movieTitle,
      poster: poster || ""
    });

    return res.status(201).json(created);

  } catch (err) {
    console.error("Error adding to watchlist:", err);
    
    // Handle duplicate key error (if unique index is set)
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: "Movie already in watchlist" 
      });
    }

    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
