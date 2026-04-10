import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

// http://localhost:8096/privateUserProfile

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // handle logout button
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // ✅ only remove token
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const decodedUser = getUserInfo();
    console.log("Decoded user:", decodedUser); // ✅ helpful for debugging

    if (decodedUser && decodedUser.username) {
      setUser(decodedUser);
    } else {
      setUser(null);
    }
  }, []);

  // If no user, show login/signup prompt
  if (!user || !user.username) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0c0c1f",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          🍿Movies<span style={{ color: "#d40a0a" }}>R</span>us
        </h2>
        <p style={{ color: "#aaa", marginBottom: "40px" }}>
          Your movie universe awaits.
        </p>

        <div
          style={{
            background: "#1a1a2e",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "380px",
            width: "100%",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <h5 style={{ marginBottom: "8px" }}>
            Already have an account?
          </h5>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Log in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "#d40a0a",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Log In
          </button>
        </div>

        <div
          style={{
            background: "#1a1a2e",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h5 style={{ marginBottom: "8px" }}>
            New to MoviesRus?
          </h5>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Create an account to get started.
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "transparent",
              border: "2px solid #d40a0a",
              color: "#d40a0a",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create an Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-center">
      <h1>{user.username}</h1>
      <p>{user.email}</p>

      {/* Tabs */}
      <ul className="nav nav-tabs justify-content-center mt-3">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "favorites" ? "active" : ""
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "watchlater" ? "active" : ""
            }`}
            onClick={() => setActiveTab("watchlater")}
          >
            Watch Later
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "comments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="mt-3">
        {activeTab === "favorites" && (
          <p>Your favorites will show here.</p>
        )}
        {activeTab === "watchlater" && (
          <p>Your watch later list will show here.</p>
        )}
        {activeTab === "comments" && (
          <p>Your comments will show here.</p>
        )}
      </div>

      {/* Logout */}
      <Button className="me-2 mt-3" onClick={handleShow}>
        Log Out
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to Log Out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrivateUserProfile;