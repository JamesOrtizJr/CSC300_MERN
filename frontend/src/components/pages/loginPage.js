import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from "../../App";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const setUser = userContext?.setUser;

  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (user) navigate("/homepage1");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data: res } = await axios.post('http://localhost:8081/user/login', data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      if (setUser) setUser(getUserInfo());
      navigate("/homepage1");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        if (error.response.status === 403) {
          setError("Account is banned");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: SECONDARY_COLOR, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      
      <h2 style={{ marginBottom: "6px" }}>
        🍿Movies<span style={{ color: PRIMARY_COLOR }}>R</span>us
      </h2>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>Welcome back.</p>

      <div style={{ background: "#1a1a2e", borderRadius: "12px", padding: "30px", maxWidth: "380px", width: "100%" }}>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: PRIMARY_COLOR, fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Enter username"
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#0c0c1f", color: "#fff" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: PRIMARY_COLOR, fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#0c0c1f", color: "#fff" }}
            />
          </div>

          {error && (
            <p style={{ color: PRIMARY_COLOR, marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="submit"
            style={{ width: "100%", padding: "12px", borderRadius: "10px", background: PRIMARY_COLOR, border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer", marginBottom: "16px" }}
          >
            Log In
          </button>

          <p style={{ textAlign: "center", color: "#aaa", fontSize: "14px", margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;