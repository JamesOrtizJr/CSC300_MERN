const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, email, username, isAdmin) => {
  try {
    const payload = {
      _id: userId,
      email: email,
      username: username,
      isAdmin: isAdmin,
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

module.exports = { generateAccessToken };