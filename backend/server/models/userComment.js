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
});

module.exports = mongoose.model("Comment", newUserCommentSchema);