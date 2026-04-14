import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

const decadeMap = {
  "1900s": { start: "1900-01-01", end: "1999-12-31" },
  "1980s": { start: "1980-01-01", end: "1989-12-31" },
  "1990s": { start: "1990-01-01", end: "1999-12-31" },
  "2000s": { start: "2000-01-01", end: "2009-12-31" },
  "2010s": { start: "2010-01-01", end: "2019-12-31" },
  "2020s": { start: "2020-01-01", end: "2029-12-31" },
};

const MovieRoulette = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [decade, setDecade] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  const wheelColors = ["#ff4d4d", "#54a0ff", "#1dd1a1"];

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
  
  useEffect(() => {
  spinSoundRef.current = new Audio("/spin.mp3");
  winSoundRef.current = new Audio("/ding.mp3");

  spinSoundRef.current.volume = 0.4;
  winSoundRef.current.volume = 0.6;
  }, []);

  const toggleGenre = (genreObj) => {
    const alreadySelected = selectedGenres.some((g) => g.id === genreObj.id);

    if (alreadySelected) {
      setSelectedGenres(selectedGenres.filter((g) => g.id !== genreObj.id));
      return;
    }

    if (selectedGenres.length >= 3) {
      setError("You can only choose up to 3 genres.");
      return;
    }

    setError("");
    setSelectedGenres([...selectedGenres, genreObj]);
  };

  const getRandomMovieByGenre = async (genreId, selectedDecade) => {
    const dateRange = decadeMap[selectedDecade] || null;

    const baseParams = {
      api_key: TMDB_API_KEY,
      language: "en-US",
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      with_genres: genreId,
    };

    if (dateRange) {
      baseParams["primary_release_date.gte"] = dateRange.start;
      baseParams["primary_release_date.lte"] = dateRange.end;
    }

    const firstRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      { params: { ...baseParams, page: 1 } }
    );

    const totalPages = Math.min(firstRes.data.total_pages || 1, 500);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const pageRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      { params: { ...baseParams, page: randomPage } }
    );

    const results = (pageRes.data.results || []).filter(
      (movie) => movie.poster_path && movie.overview
    );

    if (results.length === 0) {
      throw new Error("No movies found for that genre and decade.");
    }

    return results[Math.floor(Math.random() * results.length)];
  };

  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);

const spinWheel = () => {
  if (spinning || selectedGenres.length === 0) return;

  if (spinSoundRef.current) {
    spinSoundRef.current.currentTime = 0;
    spinSoundRef.current.play().catch(() => {});
  }

  const randomIndex = Math.floor(Math.random() * selectedGenres.length);
  const chosenGenre = selectedGenres[randomIndex];

  const sliceAngle = 360 / selectedGenres.length;
  const extraSpins = 360 * 5;
  const finalRotation =
    extraSpins + (360 - randomIndex * sliceAngle - sliceAngle / 2);

  setSpinning(true);
  setMovie(null);
  setError("");
  setRotation((prev) => prev + finalRotation);

  setTimeout(async () => {
    try {
      const randomMovie = await getRandomMovieByGenre(chosenGenre.id, decade);

      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play().catch(() => {});
      }

      setMovie({
        ...randomMovie,
        selectedGenreName: chosenGenre.name,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not fetch a movie.");
    } finally {
      setSpinning(false);
    }
  }, 4000);
};

  const closeModal = () => {
    setMovie(null);
  };

  const gradient =
    selectedGenres.length > 0
      ? selectedGenres
          .map((_, index) => {
            const start = (360 / selectedGenres.length) * index;
            const end = (360 / selectedGenres.length) * (index + 1);
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
          Pick up to 3 genres, choose an optional decade, then spin.
        </p>

        <div style={styles.genreBox}>
          <p style={styles.sectionTitle}>Choose up to 3 genres</p>
          <div style={styles.genreGrid}>
            {genres.map((g) => {
              const active = selectedGenres.some((item) => item.id === g.id);

              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g)}
                  style={{
                    ...styles.genreChip,
                    backgroundColor: active ? PRIMARY_COLOR : "#fff",
                    color: active ? "#fff" : "#000",
                  }}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <Form.Select
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
          style={styles.select}
        >
          <option value="">Any decade</option>
          <option value="1900s">1900s</option>
          <option value="1980s">1980s</option>
          <option value="1990s">1990s</option>
          <option value="2000s">2000s</option>
          <option value="2010s">2010s</option>
          <option value="2020s">2020s</option>
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
            {selectedGenres.map((genre, index) => {
              const angle = (360 / selectedGenres.length) * index;
              const textAngle = angle + 360 / selectedGenres.length / 2;

              return (
                <div
                  key={genre.id}
                  style={{
                    ...styles.labelHolder,
                    transform: `rotate(${textAngle}deg)`,
                  }}
                >
                  <span
                    style={{
                      ...styles.wheelLabel,
                      transform: `translate(-50%, -50%) rotate(90deg)`,
                    }}
                  >
                    {genre.name}
                  </span>
                </div>
              );
            })}

            <div style={styles.wheelCenter}></div>
          </div>
        </div>

        <Button
          onClick={spinWheel}
          disabled={spinning || selectedGenres.length === 0}
          style={styles.button}
        >
          {spinning ? "Spinning..." : "Spin Wheel"}
        </Button>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      {movie && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.movieTitle}>{movie.title}</h3>

            <p style={styles.landedText}>
              Landed on: <strong>{movie.selectedGenreName}</strong>
            </p>

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

            <Button onClick={closeModal} style={styles.backButton}>
              Back to Wheel
            </Button>
          </div>
        </div>
      )}
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
    maxWidth: "1000px",
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
  genreBox: {
    marginBottom: "25px",
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: "12px",
  },
  genreGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  genreChip: {
    border: "none",
    borderRadius: "20px",
    padding: "10px 16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  select: {
    maxWidth: "300px",
    width: "100%",
    height: "50px",
    borderRadius: "10px",
    margin: "0 auto 30px auto",
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
    overflow: "hidden",
  },
  labelHolder: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    transformOrigin: "center center",
  },
  wheelLabel: {
    position: "absolute",
    top: "-120px",
    left: "0px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px",
    whiteSpace: "nowrap",
    textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
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
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    animation: "fadeIn 0.4s ease",
  },
  modal: {
    background: "#fff",
    color: "#000",
    padding: "25px",
    borderRadius: "16px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "85vh",
    overflowY: "auto",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    animation: "scaleIn 0.35s ease",
  },
  movieTitle: {
    fontWeight: "700",
    marginBottom: "10px",
  },
  landedText: {
    marginBottom: "15px",
    color: "#444",
  },
  poster: {
    width: "220px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  backButton: {
    background: PRIMARY_COLOR,
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "600",
    marginTop: "15px",
  },
};

export default MovieRoulette;