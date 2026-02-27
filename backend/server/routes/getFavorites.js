const express = require("express");
const Favorites = require("../models/favorites");

const router = express.Router();

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