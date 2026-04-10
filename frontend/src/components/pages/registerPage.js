import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevents page refresh
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8097/user/signup",
        data
      );

      console.log("Signup successful:", response.data);

      // ✅ redirect user to login after successful signup
      navigate("/login");
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data || error.message
      );

      // ✅ display error message to user
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: SECONDARY_COLOR,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ marginBottom: "6px" }}>
        🍿Movies<span style={{ color: PRIMARY_COLOR }}>R</span>us
      </h2>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>
        Create your account.
      </p>

      <div
        style={{
          background: "#1a1a2e",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "380px",
          width: "100%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#0c0c1f",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#0c0c1f",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#0c0c1f",
                color: "#fff",
              }}
            />
          </div>

          {error && (
            <p style={{ color: PRIMARY_COLOR, marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: PRIMARY_COLOR,
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            Register
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#aaa",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;