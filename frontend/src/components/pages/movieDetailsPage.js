import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPosterUrl = (posterPath) => {
    return posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : "https://via.placeholder.com/300x450";
  };

  const getBackdropUrl = (backdropPath) => {
    return backdropPath
      ? `https://image.tmdb.org/t/p/original${backdropPath}`
      : "";
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [movieRes, creditsRes, videosRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
            },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
            },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
            },
          }),
        ]);

        setMovie(movieRes.data);
        setCast((creditsRes.data.cast || []).slice(0, 8));

        const officialTrailers = (videosRes.data.results || []).filter(
          (video) =>
            video.site === "YouTube" &&
            (video.type === "Trailer" || video.type === "Teaser")
        );

        setTrailers(officialTrailers);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Could not load movie details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: SECONDARY_COLOR,
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        Loading movie details...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: SECONDARY_COLOR,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>{error || "Movie not found."}</h2>
        <Button
          onClick={() => navigate("/homepage1")}
          style={{
            marginTop: "20px",
            background: PRIMARY_COLOR,
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
          }}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: SECONDARY_COLOR,
        color: "#fff",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(rgba(12,12,31,0.85), rgba(12,12,31,0.95)), url(${getBackdropUrl(
                movie.backdrop_path
              )})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            style={{
              marginBottom: "30px",
              background: PRIMARY_COLOR,
              border: "none",
              borderRadius: "10px",
              padding: "10px 18px",
            }}
          >
            ← Back
          </Button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "30px",
              alignItems: "start",
            }}
          >
            <div>
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                }}
              />
            </div>

            <div>
              <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>
                {movie.title}
              </h1>

              {movie.tagline && (
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#ccc",
                    marginBottom: "20px",
                    fontSize: "18px",
                  }}
                >
                  {movie.tagline}
                </p>
              )}

              <div style={{ marginBottom: "20px", lineHeight: "1.9" }}>
                <p>
                  <strong>Release Date:</strong> {movie.release_date || "N/A"}
                </p>
                <p>
                  <strong>Rating:</strong>{" "}
                  {movie.vote_average ? `${movie.vote_average}/10` : "N/A"}
                </p>
                <p>
                  <strong>Runtime:</strong>{" "}
                  {movie.runtime ? `${movie.runtime} minutes` : "N/A"}
                </p>
                <p>
                  <strong>Genres:</strong>{" "}
                  {movie.genres && movie.genres.length > 0
                    ? movie.genres.map((genre) => genre.name).join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {movie.original_language
                    ? movie.original_language.toUpperCase()
                    : "N/A"}
                </p>
              </div>

              <div>
                <h4 style={{ marginBottom: "10px" }}>Overview</h4>
                <p style={{ color: "#ddd", fontSize: "17px", lineHeight: "1.7" }}>
                  {movie.overview || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXTRA DETAILS */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* CAST */}
        <div style={{ marginBottom: "50px" }}>
          <h3 style={{ marginBottom: "20px" }}>Top Cast</h3>

          {cast.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "20px",
              }}
            >
              {cast.map((actor) => (
                <div
                  key={actor.cast_id || actor.credit_id}
                  style={{
                    background: "#181830",
                    borderRadius: "14px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                        : "https://via.placeholder.com/200x300"
                    }
                    alt={actor.name}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{ margin: 0, fontWeight: "700" }}>{actor.name}</p>
                  <p style={{ margin: 0, color: "#bbb", fontSize: "14px" }}>
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#ccc" }}>No cast information available.</p>
          )}
        </div>

        {/* TRAILER */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "20px" }}>Trailer</h3>

          {trailers.length > 0 ? (
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                borderRadius: "15px",
              }}
            >
              <iframe
                title="Movie Trailer"
                src={`https://www.youtube.com/embed/${trailers[0].key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "15px",
                }}
              />
            </div>
          ) : (
            <p style={{ color: "#ccc" }}>No trailer available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;