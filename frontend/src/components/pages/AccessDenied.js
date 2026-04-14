import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: SECONDARY_COLOR,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        🚫 Access Denied
      </h1>

      <p style={{ color: "#ccc", marginBottom: "20px" }}>
        You do not have permission to view this page.
      </p>

      <Button
        onClick={() => navigate("/homepage1")}
        style={{
          background: PRIMARY_COLOR,
          border: "none",
          borderRadius: "10px",
          padding: "10px 20px",
        }}
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default AccessDenied;