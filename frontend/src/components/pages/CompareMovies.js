import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "b794dfff76239d4deb38d526dc781cd7";
const IMG = "https://image.tmdb.org/t/p/w300";

const CompareMovies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie1, setMovie1] = useState(null);
  const [movie2, setMovie2] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🎬 fetch movie
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

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);

      const data = await getFullMovieData(id);
      setMovie1(data);

      const sim = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar`,
        { params: { api_key: API_KEY } }
      );
      setSuggested(sim.data.results.slice(0, 12));

      setLoading(false);
    };

    if (id) loadMovie();
  }, [id]);

  // 🎯 select second movie
  const selectMovie = async (movieId) => {
    setSelectedId(movieId);

    const data = await getFullMovieData(movieId);
    setMovie2(data);

    const sim = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/similar`,
      { params: { api_key: API_KEY } }
    );
    setSuggested(sim.data.results.slice(0, 12));
  };

  const getDirector = (crew) =>
    crew?.find((c) => c.job === "Director")?.name || "N/A";

  const getWriter = (crew) =>
    crew?.find((c) => c.job === "Writer" || c.job === "Screenplay")?.name || "N/A";

  // 🎬 CARD WITH GLOW
  const MovieCard = ({ movie }) => (
    <div style={{
      width: "450px",
      borderRadius: "20px",
      padding: "25px",
      background: "linear-gradient(145deg, #14143a, #0c0c1f)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 0 25px rgba(0,0,0,0.7)",
      transition: "all 0.3s ease"
    }}>
      <img
        src={IMG + movie.poster_path}
        style={{
          width: "100%",
          borderRadius: "14px",
          transition: "transform 0.3s"
        }}
        alt=""
      />

      <h3 style={{ marginTop: "12px" }}>{movie.title}</h3>

      <p>📅 {movie.release_date?.split("-")[0]}</p>
      <p>⏱ {movie.runtime} min</p>
      <p>🎭 {movie.genres?.map((g) => g.name).join(", ")}</p>
      <p>🎬 {getDirector(movie.crew)}</p>
      <p>✍️ {getWriter(movie.crew)}</p>

      <p style={{ fontSize: "14px" }}>{movie.overview}</p>

      <p style={{ fontSize: "14px", marginTop: "8px" }}>
        👥 {movie.cast?.map((a) => a.name).join(", ")}
      </p>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #1a1a40, #0c0c1f)",
      color: "#fff",
      padding: "25px"
    }}>

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "#ff2e63",
          border: "none",
          padding: "10px 18px",
          borderRadius: "10px",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(255,0,80,0.6)"
        }}
      >
        ← Back
      </button>

      <h2 style={{
        textAlign: "center",
        fontSize: "32px",
        marginTop: "10px",
        textShadow: "0 0 10px rgba(255,255,255,0.3)"
      }}>
        🎬 Movie Comparison
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* 🎬 MOVIES */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "60px",
        flexWrap: "wrap",
        marginTop: "50px"
      }}>
        {movie1 && <MovieCard movie={movie1} />}

        {movie2 ? (
          <MovieCard movie={movie2} />
        ) : (
          <div style={{
            width: "450px",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #666",
            borderRadius: "20px",
            opacity: 0.6
          }}>
            Pick a movie 👇
          </div>
        )}
      </div>

      {/* 🔥 SUGGESTIONS */}
      {suggested.length > 0 && (
        <div style={{ marginTop: "70px" }}>

          <h3 style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "15px",
            textShadow: "0 0 8px rgba(255,255,255,0.2)"
          }}>
            Choose a Movie
          </h3>

          <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            padding: "15px"
          }}>
            {suggested.map((m) => (
              <div
                key={m.id}
                onClick={() => selectMovie(m.id)}
                style={{
                  minWidth: "180px",
                  cursor: "pointer",
                  transform: selectedId === m.id ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.3s",
                  boxShadow: selectedId === m.id
                    ? "0 0 20px rgba(0,200,255,0.8)"
                    : "0 0 10px rgba(0,0,0,0.5)",
                  borderRadius: "10px"
                }}
              >
                <img
                  src={IMG + m.poster_path}
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
                <p style={{ fontSize: "14px", textAlign: "center" }}>
                  {m.title}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default CompareMovies;