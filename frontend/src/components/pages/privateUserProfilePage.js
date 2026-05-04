import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";

const MovieCard = ({ movie }) => (
  <div style={{ background: "#1a1a2e", padding: "16px", borderRadius: "12px", border: "1px solid #333" }}>
    <h4>{movie.title || movie.movieTitle || "Movie"}</h4>
<p>{movie.overview || "No description"}</p>
  </div>
);

const FavoritesTab = ({ favorites, navigate, onRemoveFavorite }) => (
  <div>
    <h3>Your Favorites</h3>

    {favorites.length === 0 ? (
      <p style={{ color: "#aaa" }}>No favorite movies yet.</p>
    ) : (
      <div style={{ display: "grid", gap: "16px" }}>
        {favorites.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/120x180?text=No+Image";

          return (
            <div
              key={movie._id}
              style={{
                display: "flex",
                gap: "16px",
                background: "#1a1a2e",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #333",
              }}
            >
              <img
                src={posterUrl}
                alt={movie.title || "Movie poster"}
                onClick={() => navigate(`/movies/${movie.movieId}`)}
                style={{
                  width: "120px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />

              <div style={{ flex: 1 }}>

                <img
                src={posterUrl}
                onClick={() => navigate(`/movies/${movie.movieId}`)}
/>*
                <h4
                  onClick={() => navigate(`/movies/${movie.movieId}`)}
                  style={{ cursor: "pointer" }}
                >
                  {movie.title || movie.movieTitle || "Movie"}
                </h4>

                <p style={{ color: "#aaa" }}>
                  {movie.overview || "No description"}
                </p>

                <button
                  onClick={() => onRemoveFavorite(movie.movieId)}
                  style={{
                    background: "#8b1e3f",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

/////watchlist tab

const WatchlistTab = ({ watchlist, navigate, onRemoveWatchlist }) => (
  <div>
    <h3>Your Watchlist</h3>

    {watchlist.length === 0 ? (
      <p style={{ color: "#aaa" }}>No movies in your watchlist yet.</p>
    ) : (
      <div style={{ display: "grid", gap: "16px" }}>
        {watchlist.map((movie) => {
          const posterUrl = movie.poster
            ? `https://image.tmdb.org/t/p/w500${movie.poster}`
            : "https://via.placeholder.com/120x180?text=No+Image";

          return (
            <div
              key={movie._id}
              style={{
                display: "flex",
                gap: "16px",
                background: "#1a1a2e",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #333",
              }}
            >
              <img
                src={posterUrl}
                alt={movie.movieTitle || "Movie poster"}
                onClick={() => navigate(`/movies/${movie.movieId}`)}
                style={{
                  width: "120px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />

              <div style={{ flex: 1 }}>
                <h4
                  onClick={() => navigate(`/movies/${movie.movieId}`)}
                  style={{ cursor: "pointer" }}
                >
                  {movie.movieTitle || "Movie"}
                </h4>

                <p style={{ color: "#aaa" }}>
                  {movie.overview || "No description"}
                </p>

                <button
                  onClick={() => onRemoveWatchlist(movie.movieId)}
                  style={{
                    background: "#8b1e3f",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Remove from Watchlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

////// comments tab

const CommentsTab = ({ comments, navigate, onDelete }) => (
  <div>
    <h3 style={{ marginBottom: "16px" }}>Your Comments</h3>

    {comments.length === 0 ? (
      <p style={{ color: "#aaa" }}>No comments yet.</p>
    ) : (
      <div style={{ display: "grid", gap: "16px" }}>
        {comments.map((comment) => (
          <div
            key={comment._id}
            onClick={() => navigate(`/movies/${comment.movieId}`)}
            style={{
              background: "#1a1a2e",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid #333",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <p style={{ margin: "0 0 6px 0", fontWeight: "bold", fontSize: "16px" }}>
              {comment.movieTitle || "Movie"}
            </p>

            <p style={{ margin: "0 0 10px 0", color: "#ddd" }}>
              “{comment.text}”
            </p>

            <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : ""}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(comment._id);
              }}
              style={{
                marginTop: "10px",
                background: "#ff4d4d",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const [profilePic, setProfilePic] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
  const currentUser = getUserInfo();
  setUser(currentUser);

  if (currentUser?.username) {
    const saved = localStorage.getItem(`profilePic_${currentUser.username}`);
    if (saved) setProfilePic(saved);
  }
}, []);

useEffect(() => {
  const fetchData = async () => {
  try {
    const user = getUserInfo();

    const userId =
      user?.id ||
      user?._id ||
      user?.userId ||
      user?.username;

    const favRes = await axios.get("http://localhost:8081/favorites", {
      headers: { "x-user-id": userId },
    });

    const watchRes = await axios.get("http://localhost:8081/watchlist/", {
      headers: { "x-user-id": userId },
    });

    const commentsRes = await axios.get(`http://localhost:8081/api/comments/user/${userId}`, {
      headers: { "x-user-id": userId },
    });

    console.log("PROFILE FAVORITES:", favRes.data);
    console.log("PROFILE WATCHLIST:", watchRes.data);
    console.log("PROFILE COMMENTS:", commentsRes.data);

    setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
    setWatchlist(Array.isArray(watchRes.data) ? watchRes.data : []);
    setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
  }
};

  fetchData();
}, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file || !user?.username) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      localStorage.setItem(`profilePic_${user.username}`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!user || !user.username) {
    return (
      <div style={{ minHeight: "100vh", background: SECONDARY_COLOR, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>🍿Movies<span style={{ color: PRIMARY_COLOR }}>R</span>us</h2>
        <p style={{ color: "#aaa" }}>Log in to view your profile.</p>
        <button onClick={() => navigate("/login")} style={{ padding: "12px 24px", borderRadius: "10px", background: PRIMARY_COLOR, border: "none", color: "#fff", fontWeight: "bold" }}>
          Go to Login
        </button>
      </div>
    );
  }

  const initials = user.username.slice(0, 2).toUpperCase();

  const handleRemoveFavorite = async (movieId) => {
  try {
    await axios.delete(
      `http://localhost:8081/favorites/${movieId}`,
      {
        headers: {
          "x-user-id": user.username, // IMPORTANT
        },
      }
    );

    setFavorites((prev) =>
      prev.filter((m) => m.movieId !== movieId)
    );
  } catch (err) {
    console.error(err);
  }
};

const handleRemoveWatchlist = async (movieId) => {
  try {
    const userId = user.id || user._id || user.userId || user.username;

    await axios.delete(`http://localhost:8081/watchlist/${movieId}`, {
      headers: {
        "x-user-id": userId,
      },
    });

    setWatchlist((prev) =>
      prev.filter((movie) => String(movie.movieId) !== String(movieId))
    );
  } catch (err) {
    console.error("Error removing watchlist movie:", err);
    alert("Could not remove from watchlist.");
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(`http://localhost:8081/api/comments/${commentId}`);

    setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );
  } catch (err) {
    console.error("Error deleting comment:", err);
    alert("Could not delete comment.");
  }
};

  return (
    <div style={{ minHeight: "100vh", background: SECONDARY_COLOR, color: "#fff" }}>
      <div style={{ height: "120px", background: "linear-gradient(135deg, #1a0800, #3d1200, #1a0800)" }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "-40px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", cursor: "pointer", flexShrink: 0 }} onClick={() => document.getElementById("picInput").click()}>
            {profilePic ? (
              <img src={profilePic} alt="avatar" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #0c0c1f" }} />
            ) : (
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: PRIMARY_COLOR, color: "#fff", fontSize: "1.8rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #0c0c1f" }}>
                {initials}
              </div>
            )}

            <div style={{ position: "absolute", bottom: 0, right: 0, background: "#333", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
              ✏️
            </div>

            <input id="picInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicChange} />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold" }}>{user.username}</h2>
            <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>{user.email}</p>
          </div>

          <button onClick={() => setShow(true)} style={{ padding: "10px 20px", borderRadius: "10px", background: "transparent", border: "1px solid #444", color: "#aaa", cursor: "pointer" }}>
            Log Out
          </button>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #333", marginBottom: "24px" }}>
          {["favorites", "watchlist", "comments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 24px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? `2px solid ${PRIMARY_COLOR}` : "2px solid transparent",
                color: activeTab === tab ? "#fff" : "#aaa",
                fontWeight: activeTab === tab ? "bold" : "normal",
                cursor: "pointer",
                marginBottom: "-1px",
                textTransform: "capitalize",
              }}
            >
              {tab === "watchlist" ? "Watch List" : tab}
            </button>
          ))}
        </div>

        <div style={{ padding: "20px 0" }}>
          {activeTab === "favorites" && (
  <FavoritesTab
    favorites={favorites}
    navigate={navigate}
    onRemoveFavorite={handleRemoveFavorite}
  />
)}
          {activeTab === "watchlist" && (
  <WatchlistTab
    watchlist={watchlist}
    navigate={navigate}
    onRemoveWatchlist={handleRemoveWatchlist}
  />
)}
          {activeTab === "comments" && (
  <CommentsTab comments={comments} navigate={navigate} onDelete={handleDeleteComment} />
)}
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout}>Yes, Log Out</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrivateUserProfile;