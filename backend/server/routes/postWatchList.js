const express = require("express");
const router = express.Router();
import { find } from "../models/WatchList"; 
//POST WatchList: Hersy C.

router.post("/watchlist/:imdbID", async (req, res) => {
    try {
        const {userId, movieId, movieTitle, poster} = req.body;

        const newMovie = new WatchList({
            userId,
            movieId,
            movieTitle,
            poster
        });

        await newMovie.save();
        res.status(201).json({
            message: "Movie added to watchlist",
            movie: newMovie
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
        })
