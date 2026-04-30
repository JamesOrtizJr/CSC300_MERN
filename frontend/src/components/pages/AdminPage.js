import React, { useEffect, useState } from "react";
import axios from "axios";
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

const PROFANITY_WORDS = [
  "stinky",
  "butt",
  "fart",
  "looksmaxxing",
  "emily",
  "jumanji"
];
const checkProfanity = (text) => {
  if (!text) return false;

  const lowerText = text.toLowerCase();

  return PROFANITY_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lowerText);
  });
};

function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0
  });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showBannedOnly, setShowBannedOnly] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUserIsAdmin, setSelectedUserIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [selectedUserComments, setSelectedUserComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
  const savedUser = localStorage.getItem("selectedAdminUser");

  if (savedUser) {
    handleSelectUser(JSON.parse(savedUser));
  }    
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
      console.log("CLICKED BAN:", id);   // ← add this
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

  const handleMakeAdmin = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/admin/make-admin/${userId}`
      );

      alert(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: true } : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: true } : user
        )
      );

      if (selectedUserId === userId) {
        setSelectedUserIsAdmin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to make admin");
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/admin/remove-admin/${userId}`
      );

      alert(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: false } : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: false } : user
        )
      );

      if (selectedUserId === userId) {
        setSelectedUserIsAdmin(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove admin");
    }
  };
const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(
      `http://localhost:8081/userComments/admin/delete/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setSelectedUserComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );

  } catch (err) {
    console.error("Delete comment error:", err.response?.data || err.message);
    console.error("Status:", err.response?.status);

    alert(err.response?.data?.message || "Could not delete comment.");
  }
};

const handleSearch = () => {
  const results = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );
  setFilteredUsers(results);
  setShowBannedOnly(false);
  setCurrentPage(1);
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
  setSelectedUserId("");
  setSelectedUsername("");
  setSelectedUserIsAdmin(false);
  setSelectedUserComments([]);
  setCurrentPage(1);
  localStorage.removeItem("selectedAdminUser");
  setSelectedUserComments([]);
};

  const handleShowBannedUsers = () => {
    const bannedList = users.filter((user) => user.isBanned);
    setFilteredUsers(bannedList);
    setShowBannedOnly(true);
    setCurrentPage(1);
  };

  const handleShowAllUsers = () => {
    setFilteredUsers([]);
    setSearch("");
    setShowBannedOnly(false);
    setCurrentPage(1);
  };

 const handleSelectUser = async (user) => {
  localStorage.setItem("selectedAdminUser", JSON.stringify(user));
  setSelectedUserId(user._id);
  setSelectedUsername(user.username);
  setSelectedUserIsAdmin(user.isAdmin);
  setLoadingComments(true);

  try {
    const response = await axios.get(
      `http://localhost:8081/api/comments/user/${user._id}`
    );

    const commentsWithMovies = await Promise.all(
      response.data.map(async (comment) => {
        try {
          const movieRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${comment.movieId}`,
            {
              params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
              },
            }
          );

              return {
                  ...comment,
                  movieTitle: movieRes.data.title,
                  flagged: checkProfanity(comment.text),
                };
        } catch {
              return {
                ...comment,
                movieTitle: "Unknown Movie",
                flagged: checkProfanity(comment.text),
              };
        }
      })
    );

const sortedComments = commentsWithMovies.sort((a, b) => {
  return b.flagged - a.flagged;
});

setSelectedUserComments(sortedComments);
  } catch (error) {
    console.log("Error getting user comments", error);
    setSelectedUserComments([]);
  } finally {
    setLoadingComments(false);
  }
};

const sortedUsers = [...(filteredUsers.length > 0 || showBannedOnly ? filteredUsers : users)]
  .sort((a, b) => a.username.localeCompare(b.username));

const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

const startIndex = (currentPage - 1) * usersPerPage;
const displayedUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Manage users, account status, and admin access all in one place.
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
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Banned</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr
                  key={user._id}
                  style={
                    selectedUserId === user._id
                      ? { ...styles.tr, ...styles.selectedRow }
                      : styles.tr
                  }
                >
                  <td style={styles.td}>
                    <button
                      onClick={() => handleSelectUser(user)}
                      style={styles.usernameButton}
                    >
                      {user.username}
                    </button>
                  </td>

                  <td style={styles.td}>{user.email}</td>

                  <td style={styles.td}>
                    <span
                      style={user.isAdmin ? styles.adminBadge : styles.normalBadge}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={user.isBanned ? styles.bannedBadge : styles.activeBadge}
                    >
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
        {totalPages > 1 && (
  <div style={styles.pagination}>
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      style={styles.pageButton}
    >
      Prev
    </button>

    <span style={styles.pageText}>
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      style={styles.pageButton}
    >
      Next
    </button>
  </div>
)}
      </div>

      <div style={styles.adminControlsSection}>
        <h2 style={styles.sectionTitle}>
          {selectedUsername ? `Admin Controls for ${selectedUsername}` : "Admin Controls"}
        </h2>

        {selectedUsername === "" ? (
          <p style={styles.viewLabel}>Click a username to manage admin access.</p>
        ) : (
          <div style={styles.adminControlsBox}>
            <p style={styles.selectedUserText}>
              Selected User: <strong>{selectedUsername}</strong>
            </p>

            <div style={styles.adminButtonRow}>
              {!selectedUserIsAdmin ? (
                <button
                  onClick={() => handleMakeAdmin(selectedUserId)}
                  style={styles.makeAdminButton}
                >
                  Make Admin
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveAdmin(selectedUserId)}
                  style={styles.removeAdminButton}
                >
                  Remove Admin
                </button>
              )}
            </div>
            <div style={styles.commentsSection}>
  <h3>Comments by {selectedUsername}</h3>

  {loadingComments ? (
    <p>Loading comments...</p>
  ) : selectedUserComments.length > 0 ? (
    <div style={styles.commentsList}>
      {selectedUserComments.map((comment) => (
        <div key={comment._id} style={styles.commentCard}>
          <div style={styles.commentHeader}>
            <strong>{comment.movieTitle}</strong>
            {comment.flagged && (
                    <span style={styles.flaggedBadge}>Flagged</span>
                          )}

            <button
              onClick={() => handleDeleteComment(comment._id)}
              style={styles.deleteCommentButton}
            >
              Delete
            </button>
          </div>

          <p style={styles.commentText}>{comment.text}</p>

          <small style={styles.commentSmall}>
            Comment ID: {comment._id}
          </small>
        </div>
      ))}
    </div>
  ) : (
    <p>No comments found for this user.</p>
  )}
</div>
          </div>
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
  selectedRow: {
    backgroundColor: "#eef2ff"
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
  makeAdminButton: {
    backgroundColor: "#7c3aed",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  removeAdminButton: {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "10px 16px",
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
  adminControlsSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "30px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
  },
  adminControlsBox: {
    backgroundColor: "white",
    color: "#111827",
    borderRadius: "12px",
    padding: "18px"
  },
  selectedUserText: {
    marginTop: 0,
    marginBottom: "15px"
  },
  adminButtonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },

  pagination: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginTop: "20px"
},
pageButton: {
  backgroundColor: "#1f2937",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
},
pageText: {
  color: "white",
  fontWeight: "bold"
},
commentsSection: {
  marginTop: "20px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "15px"
},
commentCard: {
  backgroundColor: "#f3f4f6",
  borderRadius: "10px",
  padding: "12px",
  marginBottom: "10px",
  textAlign: "left"
},
commentsList: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  maxHeight: "350px",
  overflowY: "auto",
  paddingRight: "8px"
},

commentHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginBottom: "8px"
},

commentText: {
  margin: "8px 0",
  lineHeight: "1.4"
},

commentSmall: {
  color: "#6b7280"
},

deleteCommentButton: {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  padding: "7px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
},
flaggedBadge: {
  marginLeft: "10px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "4px 8px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold"
},
};

export default AdminPage;