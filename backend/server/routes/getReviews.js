import { Router } from "express";
const router = Router();
import { find } from "../models/reviewModel";
//getReviews: Sam Parker

// Get all reviews for a movie
router.get("/:imdbID", async (req, res) => {
  try {
    const { imdbID } = req.params;

    const reviews = await find({ imdbID }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length === 0
        ? null
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    return res.json({
      imdbID,
      count: reviews.length,
      avgRating,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;