const express = require("express");
const Favorites = require("../models/favorites");

const router = express.Router();

// POST /favorites  
router.post("/", async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: "userId and movieId are required" });
    }

    const favorite = await Favorites.create({ userId, movieId });
    return res.status(201).json(favorite);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /favorites 
router.get("/", async (req, res) => {
  try {
    const favorites = await Favorites.find();
    return res.json(favorites);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;