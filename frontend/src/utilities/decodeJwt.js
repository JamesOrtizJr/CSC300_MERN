import jwtDecode from "jwt-decode";

const getUserInfo = () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) return null;

    const decoded = jwtDecode(token);

    // Optional safety check
    if (!decoded || !decoded.username) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default getUserInfo;