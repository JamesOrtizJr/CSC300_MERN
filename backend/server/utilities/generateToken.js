const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, email, username) => {
  try {
    const payload = {
      _id: userId,
      email: email,
      username: username,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "your_jwt_secret", // use env variable in production
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

module.exports = { generateAccessToken };