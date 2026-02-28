const express = require("express");
const router = express.Router();
const WatchListModel = require("../models/WatchList");
//getWatchList: Hersy C.

router.get("/", async (req, res) => {
  try {

    // Temporary user id (until auth is implemented)
    const userId = req.headers["x-user-id"] || "demoUser";

    const movies = await WatchListModel.find({ userId });

    return res.status(200).json(movies);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

