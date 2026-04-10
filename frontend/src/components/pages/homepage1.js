import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";

const HomePage1 = () => {
  const [rows, setRows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [light, setLight] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const bg = light ? "#f8f9fa" : SECONDARY_COLOR;
  const textColor = light ? "#000" : "#fff";

  const toggleMode = () => setLight(!light);

  const getPosterUrl = (posterPath) => {
    return posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : "https://via.placeholder.com/300x450";
  };

  // SEARCH
  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            query: search,
            language: "en-US",
            include_adult: false,
          },
        }
      );

      setRows([]);
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // CATEGORY
  const fetchByCategory = async (genreName) => {
    try {
      setLoading(true);

      const genreRes = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
          },
        }
      );

      const genreObj = (genreRes.data.genres || []).find(
        (g) => g.name.toLowerCase() === genreName.toLowerCase()
      );

      if (!genreObj) {
        setRows([]);
        setMovies([]);
        return;
      }

      const res = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
            sort_by: "popularity.desc",
            include_adult: false,
            include_video: false,
            with_genres: genreObj.id,
            page: 1,
          },
        }
      );

      setRows([]);
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Category fetch error:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // LOAD HOME
  const loadHomeMovies = async () => {
    try {
      setLoading(true);

      const [trendingRes, topRatedRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/trending/movie/week", {
          params: {
            api_key: TMDB_API_KEY,
          },
        }),
        axios.get("https://api.themoviedb.org/3/movie/top_rated", {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
            page: 1,
          },
        }),
      ]);

      const trendingMovies = trendingRes.data.results || [];
      const recommendedMovies = topRatedRes.data.results || [];

      setRows([trendingMovies, recommendedMovies]);
      setMovies([]);
    } catch (err) {
      console.error("Home load error:", err);
      setRows([]);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeMovies();
  }, []);

  const handleRandom = () => {
    navigate("/movieRoulette");
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textColor }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
        }}
      >
        <h2>
          🍿Movies<span style={{ color: "#d40a0a" }}>R</span>us
        </h2>

        <Button
          onClick={() => navigate("/profile")}
          style={{
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            background: PRIMARY_COLOR,
            border: "none",
          }}
        >
          👤
        </Button>
      </div>

      {/* SEARCH */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
        <Form
          className="d-flex mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Form.Control
            placeholder="🍭Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: "50px", borderRadius: "10px" }}
          />

          <Button
            type="submit"
            style={{
              marginLeft: "10px",
              height: "50px",
              borderRadius: "10px",
              background: PRIMARY_COLOR,
              border: "none",
            }}
          >
            Search
          </Button>
        </Form>

        {/* CATEGORY + RANDOM */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Form.Select
            value={category}
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value);
              if (value) {
                fetchByCategory(value);
              } else {
                loadHomeMovies();
              }
            }}
            style={{
              flex: 1,
              height: "50px",
              borderRadius: "10px",
            }}
          >
            <option value="">Genre</option>
            <option>Action</option>
            <option>Adventure</option>
            <option>Animation</option>
            <option>Comedy</option>
            <option>Crime</option>
            <option>Documentary</option>
            <option>Drama</option>
            <option>Family</option>
            <option>Fantasy</option>
            <option>History</option>
            <option>Horror</option>
            <option>Music</option>
            <option>Mystery</option>
            <option>Romance</option>
            <option>Science Fiction</option>
            <option>TV Movie</option>
            <option>Thriller</option>
            <option>War</option>
            <option>Western</option>
          </Form.Select>

          <Button
            onClick={handleRandom}
            style={{
              flex: 1,
              height: "50px",
              borderRadius: "10px",
              background: PRIMARY_COLOR,
              border: "none",
            }}
          >
            🎲 Random Movie
          </Button>
        </div>

        {/* DARK MODE */}
        <div className="text-center mb-4">
          <Form.Check
            type="switch"
            label={light ? "Dark Mode" : "Light Mode"}
            onChange={toggleMode}
          />
        </div>
      </div>

      {/* MOVIES */}
      <div style={{ padding: "20px 40px" }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : rows.some((row) => row.length > 0) ? (
          rows.map((row, index) => (
            <div key={index} style={{ marginBottom: "30px" }}>
              <h4>{index === 0 ? "🔥 Trending" : "⭐ Recommended"}</h4>

              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "15px",
                }}
              >
                {row.map((movie) => (
                  <div
                    key={movie.id}
                    style={{ minWidth: "150px", cursor: "pointer" }}
                    onClick={() => navigate(`/movies/${movie.id}`)}
                  >
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                    />
                    <p style={{ fontSize: "14px" }}>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : movies.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default HomePage1;