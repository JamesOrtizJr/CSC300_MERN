import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";

const MovieRoulette = () => {
  const [genre, setGenre] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const genres = [
    { id: "28", name: "Action" },
    { id: "35", name: "Comedy" },
    { id: "27", name: "Horror" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Sci-Fi" },
    { id: "16", name: "Animation" },
  ];

  const spinMovie = async () => {
    if (!genre) {
      setError("Please select a genre first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMovie(null);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/roulette/spin?genre=${genre}`
      );

      setMovie(response.data);
    } catch (err) {
      console.error("Roulette error:", err);
      setError("Could not get a movie right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Movie Roulette</h1>
        <p style={styles.subtitle}>Pick a genre and spin for a random movie.</p>

        <Form.Group style={styles.formGroup}>
          <Form.Label style={styles.label}>Choose a Genre</Form.Label>
          <Form.Select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={styles.select}
          >
            <option value="">Select genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button onClick={spinMovie} style={styles.button} disabled={loading}>
          {loading ? "Spinning..." : "Spin"}
        </Button>

        {error && <p style={styles.error}>{error}</p>}

        {movie && (
          <Card style={styles.card}>
            {movie.poster_path && (
              <Card.Img
                variant="top"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={styles.poster}
              />
            )}
            <Card.Body>
              <Card.Title style={styles.movieTitle}>{movie.title}</Card.Title>
              <Card.Text style={styles.movieText}>
                <strong>Release Date:</strong> {movie.release_date || "N/A"}
              </Card.Text>
              <Card.Text style={styles.movieText}>
                {movie.overview || "No description available."}
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: SECONDARY_COLOR,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  container: {
    width: "100%",
    maxWidth: "700px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  title: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#444",
    marginBottom: "25px",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    display: "block",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    border: "none",
    padding: "10px 24px",
    fontWeight: "600",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  card: {
    marginTop: "20px",
    border: "none",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    borderRadius: "14px",
    overflow: "hidden",
  },
  poster: {
    maxHeight: "500px",
    objectFit: "cover",
  },
  movieTitle: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
  movieText: {
    color: "#333",
  },
};

export default MovieRoulette;