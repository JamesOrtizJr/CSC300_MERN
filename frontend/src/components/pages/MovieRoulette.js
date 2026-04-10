import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

const MovieRoulette = () => {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  const wheelColors = [
    "#ff4d4d",
    "#ff9f43",
    "#feca57",
    "#1dd1a1",
    "#54a0ff",
    "#5f27cd",
    "#ee5253",
    "#10ac84",
    "#341f97",
    "#ff6b6b",
    "#48dbfb",
    "#f368e0",
    "#ff9ff3",
    "#00d2d3",
    "#ffb142",
    "#2ed573",
    "#3742fa",
    "#ff4757",
    "#70a1ff",
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
            },
          }
        );

        setGenres(res.data.genres || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError("Could not load genres.");
      }
    };

    fetchGenres();
  }, []);

  const getRandomMovieByGenre = async (genreId) => {
    try {
      const firstRes = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
            sort_by: "popularity.desc",
            include_adult: false,
            include_video: false,
            with_genres: genreId,
            page: 1,
          },
        }
      );

      const totalPages = Math.min(firstRes.data.total_pages || 1, 500);
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      const pageRes = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
            sort_by: "popularity.desc",
            include_adult: false,
            include_video: false,
            with_genres: genreId,
            page: randomPage,
          },
        }
      );

      const results = (pageRes.data.results || []).filter(
        (movie) => movie.poster_path && movie.overview
      );

      if (results.length === 0) {
        throw new Error("No movies found for that genre.");
      }

      return results[Math.floor(Math.random() * results.length)];
    } catch (err) {
      throw new Error("Could not fetch a random movie.");
    }
  };

  const spinWheel = async () => {
    if (spinning || !genre || genres.length === 0) return;

    const selectedIndex = genres.findIndex(
      (g) => String(g.id) === String(genre)
    );

    if (selectedIndex === -1) return;

    const sliceAngle = 360 / genres.length;
    const extraSpins = 360 * 5;
    const finalRotation =
      extraSpins + (360 - selectedIndex * sliceAngle - sliceAngle / 2);

    setSpinning(true);
    setMovie(null);
    setError("");
    setRotation((prev) => prev + finalRotation);

    setTimeout(async () => {
      try {
        const randomMovie = await getRandomMovieByGenre(genre);
        setMovie(randomMovie);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not fetch a movie.");
      } finally {
        setSpinning(false);
      }
    }, 4000);
  };

  const gradient =
    genres.length > 0
      ? genres
          .map((_, index) => {
            const start = (360 / genres.length) * index;
            const end = (360 / genres.length) * (index + 1);
            const color = wheelColors[index % wheelColors.length];
            return `${color} ${start}deg ${end}deg`;
          })
          .join(", ")
      : "#999 0deg 360deg";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🎲 Movie Roulette</h1>
        <p style={styles.subtitle}>
          Choose a genre, spin the wheel, and get a random movie.
        </p>

        <Form.Select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={styles.select}
        >
          <option value="">Choose a genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Form.Select>

        <div style={styles.wheelWrapper}>
          <div style={styles.pointer}></div>

          <div
            style={{
              ...styles.wheel,
              background: `conic-gradient(${gradient})`,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.25, 1)"
                : "none",
            }}
          >
            <div style={styles.wheelCenter}></div>
          </div>
        </div>

        <Button
          onClick={spinWheel}
          disabled={spinning || !genre || genres.length === 0}
          style={styles.button}
        >
          {spinning ? "Spinning..." : "Spin Wheel"}
        </Button>

        {error && <p style={styles.error}>{error}</p>}

        {movie && (
          <div style={styles.resultBox}>
            <h3 style={styles.movieTitle}>{movie.title}</h3>

            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.title}
              style={styles.poster}
            />

            <p>
              <strong>Release Date:</strong> {movie.release_date || "N/A"}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average || "N/A"}
            </p>
            <p>{movie.overview || "No description available."}</p>

            <Button
              style={styles.detailsButton}
              onClick={() => window.open(`/movies/${movie.id}`, "_self")}
            >
              View Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: SECONDARY_COLOR,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    textAlign: "center",
    color: "#fff",
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#ccc",
    marginBottom: "25px",
  },
  select: {
    maxWidth: "300px",
    margin: "0 auto 30px auto",
    height: "50px",
    borderRadius: "10px",
  },
  wheelWrapper: {
    position: "relative",
    width: "360px",
    height: "360px",
    margin: "0 auto 30px auto",
  },
  pointer: {
    position: "absolute",
    top: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "16px solid transparent",
    borderRight: "16px solid transparent",
    borderTop: "32px solid white",
    zIndex: 10,
  },
  wheel: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "8px solid white",
    boxShadow: "0 0 25px rgba(0,0,0,0.35)",
    position: "relative",
  },
  wheelCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff",
    border: `6px solid ${PRIMARY_COLOR}`,
  },
  button: {
    background: PRIMARY_COLOR,
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: "10px",
  },
  error: {
    color: "#ffb3b3",
    marginTop: "15px",
  },
  resultBox: {
    marginTop: "30px",
    background: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "14px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  },
  movieTitle: {
    fontWeight: "700",
    marginBottom: "15px",
  },
  poster: {
    width: "220px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  detailsButton: {
    background: PRIMARY_COLOR,
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "600",
    marginTop: "10px",
  },
};

export default MovieRoulette;