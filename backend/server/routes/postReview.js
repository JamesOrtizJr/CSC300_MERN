import { Router } from "express";
const router = Router();
import { create } from "../models/reviewModel";
//postReviews: Sam Parker

// Create a review for a movie
router.post("/:imdbID", async (req, res) => {
  try {
    const { imdbID } = req.params;
    const { rating } = req.body;

    // Temporary user id (until you have auth)
    const userId = req.headers["x-user-id"] || "demoUser";

    if (rating == null ) {
      return res.status(400).json({
        message: "rating required",
      });
    }

    const created = await create({
      imdbID,
      userId,
      rating,
    });

    return res.status(201).json(created);
  } catch (err) {
    // duplicate review (same user + same imdbID)
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this movie" });
    }
    return res.status(500).json({ error: err.message });
  }
});

export default router;