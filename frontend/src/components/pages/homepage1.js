import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#a2087c";
const SECONDARY_COLOR = "#0c0c1f";

const API_KEY = "ada999e2"; // 🔥 PUT YOUR REAL KEY

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

  // 🔍 SEARCH
  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
      );

      setRows([]);

      if (res.data.Response === "True") {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🎯 CATEGORY
  const fetchByCategory = async (cat) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${cat}`
      );

      setRows([]);

      if (res.data.Response === "True") {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🎬 LOAD HOME (ALWAYS WORKS)
  const loadHomeMovies = async () => {
    try {
      setLoading(true);

      const keywords = ["You", "avengers"];

      const results = await Promise.all(
        keywords.map((word) =>
          axios.get(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${word}`
          )
        )
      );

      const formatted = results.map((res) =>
        res.data && res.data.Search ? res.data.Search : []
      );

      // fallback if API fails
      if (formatted.every((row) => row.length === 0)) {
        setMovies([]);
        setRows([]);
      } else {
        setRows(formatted);
        setMovies([]);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeMovies();
  }, []);

  const handleRandom = () => {
    navigate("/roulette");
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
        <h2 style={{ color: PRIMARY_COLOR }}>🎬 MovieFinder</h2>

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
            placeholder="Search movies..."
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

        {/* CATEGORY + RANDOM (SAME SIZE) */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          
          <Form.Select
            value={category}
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value);
              if (value) fetchByCategory(value);
            }}
            style={{
              flex: 1,
              height: "50px",
              borderRadius: "10px",
            }}
          >
            <option value="">Category</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
            <option>Horror</option>
            <option>Sci-Fi</option>
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
              
              <h4>
                {index === 0 ? "🔥 Trending" : "⭐ Recommended"}
              </h4>

              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "15px",
                }}
              >
               {row.map((movie) => (
               <div key={movie.imdbID} style={{ minWidth: "150px" }}>
                    
                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/300x450"
                      }
                      alt={movie.Title}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                    />

                    <p style={{ fontSize: "14px" }}>{movie.Title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))

        ) : movies.length > 0 ? (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {movies.map((movie) => (
              <div key={movie.imdbID}>
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
                <p>{movie.Title}</p>
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