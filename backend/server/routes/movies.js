const express = require("express");
const router = express.Router();
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

// ✅ TEST ROUTE (ADD THIS FIRST)
router.get("/test", (req, res) => {
  res.send("Movies route working");
});

// ✅ GET ALL MOVIES
router.get("/all", async (req, res) => {
  try {
    console.log("GET /movies/all hit"); //  debug

    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ SEARCH
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.json([]);

    const movies = await Movie.find({
      title: { $regex: q, $options: "i" }
    });

    res.json(movies);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const axios = require("axios");

router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Error fetching movie by ID:", err.message);
    res.status(500).json({ message: "Failed to fetch movie" });
  }
});
module.exports = router;