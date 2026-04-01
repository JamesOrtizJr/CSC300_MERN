import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#a2087c";
const SECONDARY_COLOR = "#0c0c1f";

const API_KEY = "ada999e2"; // 🔥 replace this

const HomePage1 = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🌗 Light/Dark mode
  const toggleMode = () => {
    setLight(!light);
    if (!light) {
      setBgColor("white");
      setBgText("Dark Mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light Mode");
    }
  };

  // 🔍 Search OMDb
  const handleSearch = async () => {
    if (search.trim() === "") return;

    try {
      setLoading(true);

      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
      );

      console.log("OMDB RESPONSE:", res.data);

      if (res.data.Response === "True") {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("OMDB ERROR:", err);
      setLoading(false);
    }
  };

  const handleRandom = () => {
     navigate("/roulette");
  };


  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    border: "none",
    color: "white",
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-100">
        <div
          className="row d-flex justify-content-center align-items-start h-100 p-4"
          style={{ background: bgColor }}
        >
          <div className="col-md-10 col-lg-8">

          <div style ={{ position : "absolute", top: "20px", right: "30px" }}>
              <Button
              onClick={() => navigate("/profile")}
              style ={{ borderRadius: "50%", width: "50px", height: "50px",}}
              >
                👤
              </Button>
            </div>

            <h1 style={labelStyling} className="text-center mb-4">

              🎬 Movie Search
            </h1>

            {/* 🔍 SEARCH BAR */}
            <Form
              className="d-flex mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Form.Control
                type="text"
                placeholder="Search movie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" style={buttonStyling} className="ms-2">
                Search
              </Button>
            </Form>


              {/* CATEGORY */}
              <div 
              style = {{ display : "flex" , gap : "10px" , marginBottom : "20px"}}
              >
              <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ height: "45px", flex: 1}}
            >
              <option value="">Category</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </Form.Select>

            {/* RANDOM MOVIE */}
              <Button onClick = {handleRandom}
               style ={{ height: "45px", minWidth: "160px", border: "none", background: PRIMARY_COLOR }}
               > 
                🎲 Random Movie
              </Button>
              </div>

            {/* 🌗 TOGGLE */}
            <div className="form-check form-switch mb-4 text-center">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={toggleMode}
              />
              <label className="form-check-label text-muted">{bgText}</label>
            </div>

            {/* 📦 RESULTS */}
            {loading ? (
              <p style={{ color: light ? "black" : "white", textAlign: "center" }}>
                Loading movies...
              </p>
            ) : movies.length === 0 ? (
              <p style={{ color: light ? "black" : "white", textAlign: "center" }}>
                No movies found
              </p>
            ) : (
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "15px",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {movies.map((movie) => (
                  <li
                    key={movie.imdbID}
                    style={{
                      background: "#f4f4f4",
                      padding: "15px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <h5>{movie.Title}</h5>
                    <p style={{ fontSize: "12px", color: "#555" }}>
                      ID: {movie.imdbID}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage1;