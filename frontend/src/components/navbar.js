import React from "react";
import { Link } from "react-router-dom";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";

const Navbar = () => {
  return (
    <nav
      style={{
        background: SECONDARY_COLOR,
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #222",
      }}
    >
      <Link
        to="/homepage1"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        🍿Movies<span style={{ color: PRIMARY_COLOR }}>R</span>us
      </Link>

      <div style={{ display: "flex", gap: "24px" }}>
        <Link to="/homepage1" style={linkStyle}>
          Home
        </Link>
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
        <Link to="/privateUserProfile" style={linkStyle}>
          Profile
        </Link>
      </div>

          <Link to="/admin" style={linkStyle}>
    Admin
  </Link>
  
    </nav>
  );
};

const linkStyle = {
  color: "#ddd",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};

export default Navbar;