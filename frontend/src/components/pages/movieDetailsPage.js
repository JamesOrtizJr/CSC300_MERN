import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const CARD_COLOR = "#181830";
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [collectionMovies, setCollectionMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPosterHovered, setIsPosterHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);

  const FAVORITES_KEY = "favoriteMovies";
  const WATCHLIST_KEY = "watchlistMovies";

  const getPosterUrl = (posterPath) =>
    posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : "https://via.placeholder.com/300x450?text=No+Poster";

  const getBackdropUrl = (backdropPath) =>
    backdropPath
      ? `https://image.tmdb.org/t/p/original${backdropPath}`
      : "";

  const getYear = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.slice(0, 4);
  };

  const formatMovieCardData = (movieObj) => ({
    id: movieObj.id,
    title: movieObj.title,
    poster_path: movieObj.poster_path,
    release_date: movieObj.release_date,
    vote_average: movieObj.vote_average,
  });

  const trailer = useMemo(() => {
    return trailers.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    ) || trailers.find(
      (video) => video.site === "YouTube" && video.type === "Teaser"
    ) || null;
  }, [trailers]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    const watchlist = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");

    setIsFavorite(favorites.some((movie) => String(movie.id) === String(id)));
    setIsWatchlist(watchlist.some((movie) => String(movie.id) === String(id)));
  }, [id]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [movieRes, videosRes, similarRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
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
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
              page: 1,
            },
          }),
        ]);

        const movieData = movieRes.data;
        setMovie(movieData);
        setTrailers(videosRes.data.results || []);
        setSimilarMovies((similarRes.data.results || []).slice(0, 12));

        if (movieData.belongs_to_collection?.id) {
          const collectionRes = await axios.get(
            `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection.id}`,
            {
              params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
              },
            }
          );

          const parts = (collectionRes.data.parts || [])
            .sort((a, b) => {
              const dateA = a.release_date || "";
              const dateB = b.release_date || "";
              return dateA.localeCompare(dateB);
            })
            .filter((item) => String(item.id) !== String(movieData.id));

          setCollectionMovies(parts);
        } else {
          setCollectionMovies([]);
        }
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

  const toggleStoredMovie = (storageKey, currentStateSetter, currentStateValue) => {
    if (!movie) return;

    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const movieToStore = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    let updated;

    if (currentStateValue) {
      updated = existing.filter((item) => String(item.id) !== String(movie.id));
      currentStateSetter(false);
    } else {
      const alreadyExists = existing.some(
        (item) => String(item.id) === String(movie.id)
      );

      updated = alreadyExists ? existing : [...existing, movieToStore];
      currentStateSetter(true);
    }

    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleToggleFavorite = () => {
    toggleStoredMovie(FAVORITES_KEY, setIsFavorite, isFavorite);
  };

  const handleToggleWatchlist = () => {
    toggleStoredMovie(WATCHLIST_KEY, setIsWatchlist, isWatchlist);
  };

  const renderMovieRow = (title, movies) => {
    if (!movies || movies.length === 0) return null;

    return (
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "18px" }}>{title}</h3>

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
            paddingBottom: "8px",
          }}
        >
          {movies.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/movies/${item.id}`)}
              style={{
                minWidth: "180px",
                maxWidth: "180px",
                cursor: "pointer",
                background: CARD_COLOR,
                borderRadius: "14px",
                padding: "12px",
                flexShrink: 0,
              }}
            >
              <img
                src={getPosterUrl(item.poster_path)}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#bbb",
                  fontSize: "14px",
                }}
              >
                {getYear(item.release_date)} •{" "}
                {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      <div
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(rgba(12,12,31,0.82), rgba(12,12,31,0.96)), url(${getBackdropUrl(
                movie.backdrop_path
              )})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "40px 20px 50px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1150px",
            margin: "0 auto",
          }}
        >
          <Button
            onClick={() => navigate("/homepage1")}
            style={{
              marginBottom: "28px",
              background: PRIMARY_COLOR,
              border: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              fontWeight: "600",
            }}
          >
            ← Back
          </Button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                onMouseEnter={() => setIsPosterHovered(true)}
                onMouseLeave={() => setIsPosterHovered(false)}
                style={{
                  width: "100%",
                  height: "480px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                  background: "#111",
                  cursor: trailer ? "pointer" : "default",
                  marginBottom: "16px",
                }}
              >
                {!isPosterHovered || !trailer ? (
                  <>
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {trailer && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.35)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "20px",
                          fontWeight: "700",
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        ▶ Hover to play trailer
                      </div>
                    )}
                  </>
                ) : (
                  <iframe
                    title="Movie Trailer Preview"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=1&loop=1&playlist=${trailer.key}&modestbranding=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                <Button
                  onClick={() => navigate(`/movies/${movie.id}/cast-crew`)}
                  style={{
                    background: PRIMARY_COLOR,
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontWeight: "700",
                  }}
                >
                  View Cast & Crew
                </Button>

                <Button
                  onClick={handleToggleWatchlist}
                  style={{
                    background: isWatchlist ? "#2d7d46" : "#30304a",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontWeight: "700",
                  }}
                >
                  {isWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                </Button>

                <Button
                  onClick={handleToggleFavorite}
                  style={{
                    background: isFavorite ? "#8b1e3f" : "#30304a",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontWeight: "700",
                  }}
                >
                  {isFavorite ? "♥ Favorited" : "♡ Add to Favorites"}
                </Button>
              </div>
            </div>

            <div>
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
                  gap: "10px 24px",
                  marginBottom: "24px",
                  lineHeight: "1.8",
                }}
              >
                <p><strong>Release Date:</strong> {movie.release_date || "N/A"}</p>
                <p><strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average}/10` : "N/A"}</p>
                <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : "N/A"}</p>
                <p><strong>Status:</strong> {movie.status || "N/A"}</p>
                <p>
                  <strong>Genres:</strong>{" "}
                  {movie.genres?.length
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

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ marginBottom: "10px" }}>Overview</h4>
                <p
                  style={{
                    color: "#ddd",
                    fontSize: "17px",
                    lineHeight: "1.75",
                    marginBottom: 0,
                  }}
                >
                  {movie.overview || "No description available."}
                </p>
              </div>

              {movie.belongs_to_collection && (
                <div
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#ddd",
                  }}
                >
                  Part of the{" "}
                  <strong>{movie.belongs_to_collection.name}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "30px 20px 50px 20px",
        }}
      >
        {collectionMovies.length > 0 &&
          renderMovieRow(
            `More in the ${movie.belongs_to_collection?.name || "Collection"}`,
            collectionMovies.map(formatMovieCardData)
          )}

        {renderMovieRow(
          "Similar Movies",
          similarMovies.map(formatMovieCardData)
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;