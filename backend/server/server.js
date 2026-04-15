const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const movieRoutes = require("./routes/movies");
const loginRoute = require("./routes/userLogin");
const getAllUsersRoute = require("./routes/userGetAllUsers");
const registerRoute = require("./routes/userSignUp");
const getUserByIdRoute = require("./routes/userGetUserById");
const dbConnection = require("./config/db.config");
const editUser = require("./routes/userEditUser");
const deleteUser = require("./routes/userDeleteAll");
const postWatchList = require("./routes/postWatchList");
const getWatchList = require("./routes/getWatchList");

const postFavoritesRoute = require("./routes/postFavorites");
const getFavoritesRoute = require("./routes/getFavorites");

const makeCommentRoute = require("./routes/userComments/userMakeComment");
const getAllUserCommentsRoute = require("./routes/userComments/userGetAllUserComments");

// REVIEW
const getReviewsRoute = require("./routes/getReviews");
const postReviewRoute = require("./routes/postReview");

// ADMIN
const adminRoute = require("./routes/adminRoutes/admin");

const SERVER_PORT = process.env.PORT || 8081;

// Database connection
dbConnection();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// User routes
app.use("/user", loginRoute);
app.use("/user", registerRoute);
app.use("/user", getAllUsersRoute);
app.use("/user", getUserByIdRoute);
app.use("/user", editUser);
app.use("/user", deleteUser);

// Comment routes
app.use("/api/comments", makeCommentRoute);
app.use("/api/comments", getAllUserCommentsRoute);

// Favorites routes
app.use("/favorites", postFavoritesRoute);
app.use("/favorites", getFavoritesRoute);

// Review routes
app.use("/reviews", getReviewsRoute);
app.use("/reviews", postReviewRoute);

// Watchlist routes
app.use("/watchlist", postWatchList);
app.use("/watchlist", getWatchList);

// Movie routes
app.use("/movies", movieRoutes);

// Admin routes
app.use("/admin", adminRoute);

// Start server unless running tests
if (process.env.NODE_ENV !== "test") {
  app.listen(SERVER_PORT, () => {
    console.log(
      `The backend service is running on port ${SERVER_PORT}`
    );
  });
}

module.exports = app;