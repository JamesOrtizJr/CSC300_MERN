import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const API_KEY = "b794dfff76239d4deb38d526dc781cd7";
const IMG = "https://image.tmdb.org/t/p/w300";

const CompareMovies = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movie1, setMovie1] = useState(null);
  const [movie2, setMovie2] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch full movie data (details + credits)
  const getFullMovieData = async (movieId) => {
    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      { params: { api_key: API_KEY } }
    );

    const creditsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      { params: { api_key: API_KEY } }
    );

    return {
      ...movieRes.data,
      cast: creditsRes.data.cast.slice(0, 5),
      crew: creditsRes.data.crew
    };
  };

  // 🎬 Load first movie
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);

        const data = await getFullMovieData(id);
        setMovie1(data);

        const sim = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar`,
          { params: { api_key: API_KEY } }
        );
        setSuggested(sim.data.results.slice(0, 10));

      } catch (err) {
        console.error("Error loading movie:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadMovie();
  }, [id]);

  // 🎯 Select second movie
  const selectMovie = async (movieId) => {
    const data = await getFullMovieData(movieId);
    setMovie2(data);
  };

  // 🏆 Winner logic
  const winner =
    movie1 && movie2
      ? movie1.vote_average === movie2.vote_average
        ? "tie"
        : movie1.vote_average > movie2.vote_average
        ? "movie1"
        : "movie2"
      : null;

  // 🎬 Extract crew helpers
  const getDirector = (crew) =>
    crew?.find((c) => c.job === "Director")?.name || "N/A";

  const getWriter = (crew) =>
    crew?.find((c) => c.job === "Writer" || c.job === "Screenplay")?.name || "N/A";

  // 🎬 Movie card component
  const MovieCard = ({ movie, isWinner }) => (
    <div style={{
      width: "320px",
      background: "#12122b",
      borderRadius: "16px",
      padding: "15px",
      border: isWinner ? "2px solid gold" : "1px solid #333",
      boxShadow: "0 8px 20px rgba(0,0,0,0.5)"
    }}>
      <img
        src={IMG + movie.poster_path}
        style={{ width: "100%", borderRadius: "12px" }}
        alt=""
      />

      <h3 style={{ marginTop: "10px" }}>{movie.title}</h3>

      <p>⭐ {movie.vote_average}</p>
      <p>📅 {movie.release_date?.split("-")[0]}</p>
      <p>⏱ {movie.runtime} min</p>

      <p>
        🎭 {movie.genres?.map((g) => g.name).join(", ")}
      </p>

      <p>🎬 Director: {getDirector(movie.crew)}</p>
      <p>✍️ Writer: {getWriter(movie.crew)}</p>

      <p style={{ fontSize: "13px", marginTop: "8px" }}>
        {movie.overview}
      </p>

      <p style={{ marginTop: "10px", fontSize: "13px" }}>
        👥 {movie.cast?.map((a) => a.name).join(", ")}
      </p>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0c1f",
      color: "#fff",
      padding: "20px",
      maxWidth: "1200px",
      margin: "auto"
    }}>

      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          background: "#d40a0a",
          border: "none",
          padding: "10px 16px",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <h2 style={{ textAlign: "center" }}>⚖️ Movie Battle</h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* 🎬 COMPARISON */}
      {movie1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "30px"
        }}>
          <MovieCard movie={movie1} isWinner={winner === "movie1"} />

          <h2 style={{ alignSelf: "center" }}>VS</h2>

          {movie2 ? (
            <MovieCard movie={movie2} isWinner={winner === "movie2"} />
          ) : (
            <div style={{
              width: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #555",
              borderRadius: "16px"
            }}>
              Pick a movie 👇
            </div>
          )}
        </div>
      )}

      {/* 🏆 Winner */}
      {winner && (
        <h3 style={{
          textAlign: "center",
          marginTop: "20px",
          color: "gold"
        }}>
          {winner === "tie"
            ? "🤝 It's a Tie!"
            : `🏆 Winner: ${winner === "movie1" ? movie1.title : movie2.title}`}
        </h3>
      )}

      {/* 🔥 Suggested Movies */}
      {suggested.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h4 style={{ textAlign: "center" }}>Pick a Similar Movie</h4>

          <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "12px",
            marginTop: "15px",
            paddingBottom: "10px"
          }}>
            {suggested.map((m) => (
              <div
                key={m.id}
                onClick={() => selectMovie(m.id)}
                style={{
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                <img
                  src={IMG + m.poster_path}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
                <p style={{ fontSize: "12px" }}>{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareMovies;