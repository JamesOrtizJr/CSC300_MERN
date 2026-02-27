import { Router } from "express";
const router = Router();
import { find } from "../models/WatchList";
//getWatchList: Hersy C.

router.get("/watchlist/:userID", async (req, res) => {
  try {
    const { userID } = req.params;  

    const movies = await WatchList.find({ userID });

    res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});