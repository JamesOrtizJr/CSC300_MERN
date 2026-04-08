const express = require("express");
const router = express.Router();


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

module.exports = router;