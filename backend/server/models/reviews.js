import { Schema, model } from "mongoose";
//Reviews: Sam Parker
const reviewSchema = new Schema(
  {
    imdbID: { type: String, required: true, index: true },

    // If you have real auth later, change this to ObjectId ref: "User"
    userId: { type: String, required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Optional: prevent duplicate reviews by same user for same movie
reviewSchema.index({ imdbID: 1, userId: 1 }, { unique: true });

export default model("Review", reviewSchema);

