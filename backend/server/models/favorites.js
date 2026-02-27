const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    movieId: { type: String, required: true }
});

module.exports = mongoose.model("Favorites", favoritesSchema);