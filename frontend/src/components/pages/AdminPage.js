import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0
  });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showBannedOnly, setShowBannedOnly] = useState(false);

  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUserReviews, setSelectedUserReviews] = useState([]);

  useEffect(() => {
    getStats();
    getAllUsers();
  }, []);

  const getStats = async () => {
    try {
      const response = await axios.get("http://localhost:8081/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.log("Error getting stats", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/user/getAll");
      setUsers(response.data);
    } catch (error) {
      console.log("Error getting users", error);
    }
  };

  const banUser = async (id) => {
    try {
      await axios.put(`http://localhost:8081/admin/ban/${id}`);
      getStats();
      getAllUsers();

      if (showBannedOnly) {
        setFilteredUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isBanned: true } : user
          )
        );
      }

      if (selectedUsername) {
        getAllUsers();
      }
    } catch (error) {
      console.log("Error banning user", error);
    }
  };

  const unbanUser = async (id) => {
    try {
      await axios.put(`http://localhost:8081/admin/unban/${id}`);
      getStats();
      getAllUsers();

      if (showBannedOnly) {
        setFilteredUsers((prev) => prev.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.log("Error unbanning user", error);
    }
  };

  const handleSearch = () => {
    const results = users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
    setShowBannedOnly(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearch("");
    setFilteredUsers([]);
    setShowBannedOnly(false);
    setSelectedUsername("");
    setSelectedUserReviews([]);
  };

  const handleShowBannedUsers = () => {
    const bannedList = users.filter((user) => user.isBanned);
    setFilteredUsers(bannedList);
    setShowBannedOnly(true);
  };

  const handleShowAllUsers = () => {
    setFilteredUsers([]);
    setSearch("");
    setShowBannedOnly(false);
  };

  const getUserReviews = async (userId, username) => {
    try {
      const response = await axios.get(`http://localhost:8081/reviews/user/${userId}`);
      setSelectedUsername(username);
      setSelectedUserReviews(response.data.reviews);
    } catch (error) {
      console.log("Error getting user reviews", error);
      setSelectedUsername(username);
      setSelectedUserReviews([]);
    }
  };

  const displayedUsers =
    filteredUsers.length > 0 || showBannedOnly ? filteredUsers : users;

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Manage users, account status, and review activity all in one place.
        </p>
      </div>

      <div style={styles.statsContainer}>
        <div
          style={{ ...styles.statCard, ...styles.clickableCard }}
          onClick={handleShowAllUsers}
        >
          <h3 style={styles.statTitle}>Total Users</h3>
          <p style={styles.statNumber}>{stats.totalUsers}</p>
          <p style={styles.cardHint}>Click to view all users</p>
        </div>

        <div
          style={{ ...styles.statCard, ...styles.clickableCard }}
          onClick={handleShowBannedUsers}
        >
          <h3 style={styles.statTitle}>Banned Users</h3>
          <p style={styles.statNumber}>{stats.bannedUsers}</p>
          <p style={styles.cardHint}>Click to view banned users</p>
        </div>
      </div>

      <div style={styles.searchSection}>
        <h2 style={styles.sectionTitle}>Search Users</h2>
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Enter username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />

          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>

          <button onClick={handleReset} style={styles.resetButton}>
            Reset
          </button>
        </div>
      </div>

      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Users</h2>
          <p style={styles.viewLabel}>
            {showBannedOnly
              ? "Showing banned users"
              : filteredUsers.length > 0
              ? "Showing search results"
              : "Showing all users"}
          </p>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Admin</th>
              <th style={styles.th}>Banned</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr key={user._id} style={styles.tr}>
                  <td style={styles.td}>
                    <button
                      onClick={() => getUserReviews(user._id, user.username)}
                      style={styles.usernameButton}
                    >
                      {user.username}
                    </button>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={user.isAdmin ? styles.adminBadge : styles.normalBadge}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={user.isBanned ? styles.bannedBadge : styles.activeBadge}>
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {!user.isBanned ? (
                      <button
                        onClick={() => banUser(user._id)}
                        style={styles.banButton}
                      >
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => unbanUser(user._id)}
                        style={styles.unbanButton}
                      >
                        Unban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.emptyState}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.reviewsSection}>
        <h2 style={styles.sectionTitle}>
          {selectedUsername ? `Reviews by ${selectedUsername}` : "User Reviews"}
        </h2>

        {selectedUsername === "" ? (
          <p style={styles.viewLabel}>Click a username to view their reviews.</p>
        ) : selectedUserReviews.length > 0 ? (
          <div>
            {selectedUserReviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <p><strong>Movie ID:</strong> {review.imdbID}</p>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Comment:</strong> {review.comment || "No comment"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.viewLabel}>This user has no reviews.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    color: "white",
    fontFamily: "Arial, sans-serif"
  },
  headerSection: {
    marginBottom: "30px"
  },
  title: {
    margin: 0,
    fontSize: "36px"
  },
  subtitle: {
    marginTop: "10px",
    color: "#d1d5db"
  },
  statsContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px"
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "20px",
    minWidth: "220px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)"
  },
  clickableCard: {
    cursor: "pointer"
  },
  statTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#e5e7eb"
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "12px 0"
  },
  cardHint: {
    margin: 0,
    fontSize: "13px",
    color: "#cbd5e1"
  },
  searchSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "15px"
  },
  searchRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  input: {
    flex: 1,
    minWidth: "240px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    color: "black",            
    backgroundColor: "white" 
  },
  searchButton: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "bold"
  },
  resetButton: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#6b7280",
    color: "white",
    fontWeight: "bold"
  },
  tableSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "15px"
  },
  viewLabel: {
    margin: 0,
    color: "#d1d5db"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    color: "#111827",
    borderRadius: "12px",
    overflow: "hidden"
  },
  th: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: "14px",
    textAlign: "left"
  },
  tr: {
    borderBottom: "1px solid #e5e7eb"
  },
  td: {
    padding: "14px"
  },
  adminBadge: {
    backgroundColor: "#ddd6fe",
    color: "#5b21b6",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  normalBadge: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  bannedBadge: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  activeBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  banButton: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  unbanButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  emptyState: {
    textAlign: "center",
    padding: "20px",
    color: "#6b7280"
  },
  usernameButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: 0
  },
  reviewsSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "30px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
  },
  reviewCard: {
    backgroundColor: "white",
    color: "#111827",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "15px"
  }
};

export default AdminPage;