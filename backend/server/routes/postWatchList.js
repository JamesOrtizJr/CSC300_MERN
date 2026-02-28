const express = require("express");
const router = express.Router();
const WatchListModel = require("../models/WatchList");
//POST WatchList: Hersy C.

router.post("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { movieTitle, poster } = req.body;

    // Temporary user id (until auth is implemented)
    const userId = req.headers["x-user-id"] || "demoUser";

    if (!movieTitle) {
      return res.status(400).json({ message: "movieTitle required" });
    }

    const created = await WatchListModel.create({
      userId,
      movieId,
      movieTitle,
      poster: poster || ""
    });

    return res.status(201).json(created);

  } catch (err) {

    // Prevent duplicate watchlist entries (if you add unique index later)
    if (err.code === 11000) {
      return res.status(409).json({ message: "Movie already in watchlist" });
    }

    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;