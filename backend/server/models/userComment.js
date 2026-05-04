const mongoose = require("mongoose");

const newUserCommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  movieId: {
    type: String,
    required: true,
    index: true,
  },

  text: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: false,
  },
  movieTitle: {
    type: String,
  },
  moviePoster: {
    type: String,
  }
})

module.exports = mongoose.model("Comment", newUserCommentSchema);