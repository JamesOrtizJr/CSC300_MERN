const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: String, required: true },
  title: { type: String },
  name: { type: String },
  overview: { type: String },
  poster_path: { type: String },
  release_date: { type: String },
});

module.exports = mongoose.model("Favorites", favoritesSchema);