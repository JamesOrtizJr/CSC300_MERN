import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePicChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    setProfilePic(reader.result);
    localStorage.setItem(`profilePic_${user.username}`, reader.result);
  };
  reader.readAsDataURL(file);
};

  useEffect(() => {
  const currentUser = getUserInfo();
  setUser(currentUser);
  if (currentUser?.username) {
    const saved = localStorage.getItem(`profilePic_${currentUser.username}`);
    if (saved) setProfilePic(saved);
  }
}, []);

useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8081/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(res.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  if (user) {
    fetchFavorites();
  }
}, [user]);


  if (!user || !user.username) return (
    <div style={{ minHeight: "100vh", background: SECONDARY_COLOR, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ marginBottom: "6px" }}>
        🍿Movies<span style={{ color: PRIMARY_COLOR }}>R</span>us
      </h2>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>Your movie universe awaits.</p>

      <div style={{ background: "#1a1a2e", borderRadius: "12px", padding: "30px", maxWidth: "380px", width: "100%", marginBottom: "20px", textAlign: "center" }}>
        <h5 style={{ marginBottom: "8px" }}>Already have an account?</h5>
        <p style={{ color: "#aaa", fontSize: "14px" }}>Log in to view your profile.</p>
        <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: PRIMARY_COLOR, border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          Log In
        </button>
      </div>

      <div style={{ background: "#1a1a2e", borderRadius: "12px", padding: "30px", maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <h5 style={{ marginBottom: "8px" }}>New to MoviesRus?</h5>
        <p style={{ color: "#aaa", fontSize: "14px" }}>Create an account to get started.</p>
        <button onClick={() => navigate("/signup")} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "transparent", border: `2px solid ${PRIMARY_COLOR}`, color: PRIMARY_COLOR, fontWeight: "bold", cursor: "pointer" }}>
          Create an Account
        </button>
      </div>
    </div>
  );

  const initials = user.username.slice(0, 2).toUpperCase();

  const FavoritesTab = () => {
  return (
    <div>
      <h3 style={{ marginBottom: "16px" }}>Your Favorites</h3>

      {favorites.length === 0 ? (
        <p style={{ color: "#aaa" }}>No favorite movies yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {favorites.map((movie) => (
            <div
              key={movie._id}
              style={{
                background: "#1a1a2e",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #333",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0" }}>
                {movie.title || movie.name}
              </h4>
              <p style={{ margin: 0, color: "#aaa" }}>
                {movie.overview || "No description available."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WatchlistTab = () => {
  return (
    <div>
      <h3 style={{ marginBottom: "16px" }}>Your Watchlist</h3>
      <p style={{ color: "#aaa" }}>Movies you saved for later will show here.</p>
    </div>
  );
};

const CommentsTab = () => {
  return (
    <div>
      <h3 style={{ marginBottom: "16px" }}>Your Comments</h3>
      <p style={{ color: "#aaa" }}>Your movie comments and reviews will show here.</p>
    </div>
  );
};

  return (
    <div style={{ minHeight: "100vh", background: SECONDARY_COLOR, color: "#fff" }}>

      {/* Top banner */}
      <div style={{ height: "120px", background: "linear-gradient(135deg, #1a0800, #3d1200, #1a0800)" }} />

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 60px" }}>

        {/* Avatar + info row */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "-40px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", cursor: "pointer", flexShrink: 0 }} onClick={() => document.getElementById("picInput").click()}>
  {profilePic
    ? <img src={profilePic} alt="avatar" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #0c0c1f" }} />
    : <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: PRIMARY_COLOR, color: "#fff", fontSize: "1.8rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #0c0c1f" }}>{initials}</div>
  }

  
  <div style={{ position: "absolute", bottom: 0, right: 0, background: "#333", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✏️</div>
  <input id="picInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicChange} />
</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold" }}>{user.username}</h2>
            <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>{user.email}</p>
          </div>
          <button onClick={handleShow} style={{ padding: "10px 20px", borderRadius: "10px", background: "transparent", border: "1px solid #444", color: "#aaa", cursor: "pointer" }}>
            Log Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #333", marginBottom: "24px" }}>
          {["favorites", "watchlist", "comments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: "10px 24px", background: "transparent", border: "none", borderBottom: activeTab === tab ? `2px solid ${PRIMARY_COLOR}` : "2px solid transparent", color: activeTab === tab ? "#fff" : "#aaa", fontWeight: activeTab === tab ? "bold" : "normal", cursor: "pointer", marginBottom: "-1px", textTransform: "capitalize" }}
            >
              {tab === "watchlist" ? "Watch List" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}

      
    <div style={{ padding: "20px 0" }}>
  {activeTab === "favorites" && <FavoritesTab />}
  {activeTab === "watchlist" && <WatchlistTab />}
  {activeTab === "comments" && <CommentsTab />}
</div>

      </div>

      {/* Logout Modal */}
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout}>Yes, Log Out</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrivateUserProfile;