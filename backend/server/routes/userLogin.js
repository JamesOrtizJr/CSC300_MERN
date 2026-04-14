const express = require("express");
const router = express.Router();
const { userLoginValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utilities/generateToken");

router.post("/login", async (req, res) => {
  try {
    const { error } = userLoginValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.errors[0].message });
    }

    const { username, password } = req.body;

    const user = await newUserModel.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res
        .status(401)
        .send({ message: "Username or password does not exist, try again" });
    }

    // Banned users cannot log in
    if (user.isBanned) {
      return res.status(403).send({ message: "Account is banned" });
    }

    // Check if the password is correct
    const checkPasswordValidity = await bcrypt.compare(password, user.password);

    if (!checkPasswordValidity) {
      return res
        .status(401)
        .send({ message: "Username or password does not exist, try again" });
    }

    // Create JWT without including the password
    const accessToken = generateAccessToken(user._id, user.email, user.username,  user.isAdmin
  );

    return res
      .header("Authorization", accessToken)
      .send({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;