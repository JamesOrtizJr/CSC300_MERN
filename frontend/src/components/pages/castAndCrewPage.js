import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";
const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";

function CastCrewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieTitle, setMovieTitle] = useState("");
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProfileUrl = (profilePath) => {
    return profilePath
      ? `https://image.tmdb.org/t/p/w300${profilePath}`
      : "https://via.placeholder.com/200x300?text=No+Image";
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        setError("");

        const [movieRes, creditsRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
          ).then((res) => res.json()),
        ]);

        if (movieRes.success === false || creditsRes.success === false) {
          setError("Movie not found.");
          return;
        }

        setMovieTitle(movieRes.title || "Movie");
        setCast(creditsRes.cast || []);
        setCrew(creditsRes.crew || []);
      } catch (err) {
        console.error("Error fetching cast data:", err);
        setError("Could not load cast and crew.");
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: SECONDARY_COLOR,
          color: "#fff",
          padding: "24px",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: SECONDARY_COLOR,
          color: "#fff",
          padding: "24px",
        }}
      >
        <button
          onClick={() => navigate(`/movies/${id}`)}
          style={{
            marginBottom: "16px",
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            background: PRIMARY_COLOR,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Movie
        </button>

        <p>{error}</p>
      </div>
    );
  }

  const directors = crew.filter((person) => person.job === "Director");
  const writers = crew.filter(
    (person) =>
      person.job === "Writer" ||
      person.job === "Screenplay" ||
      person.job === "Story"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: SECONDARY_COLOR,
        color: "#fff",
        padding: "24px",
      }}
    >
      <button
        onClick={() => navigate(`/movies/${id}`)}
        style={{
          marginBottom: "16px",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          background: PRIMARY_COLOR,
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Back to Movie
      </button>

      <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "24px" }}>
        {movieTitle} Cast & Crew
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "32px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Actors</h2>

          {cast.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "20px",
              }}
            >
              {cast.map((person) => (
                <div
                  key={person.credit_id}
                  style={{
                    background: "#181830",
                    borderRadius: "14px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={getProfileUrl(person.profile_path)}
                    alt={person.name}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{ margin: 0, fontWeight: "700" }}>{person.name}</p>
                  <p style={{ margin: 0, color: "#bbb", fontSize: "14px" }}>
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No actor information available.</p>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Directors</h2>

          {directors.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "20px",
              }}
            >
              {directors.map((person) => (
                <div
                  key={person.credit_id}
                  style={{
                    background: "#181830",
                    borderRadius: "14px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={getProfileUrl(person.profile_path)}
                    alt={person.name}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{ margin: 0, fontWeight: "700" }}>{person.name}</p>
                  <p style={{ margin: 0, color: "#bbb", fontSize: "14px" }}>
                    {person.job}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No director information available.</p>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Writers</h2>

          {writers.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "20px",
              }}
            >
              {writers.map((person) => (
                <div
                  key={person.credit_id}
                  style={{
                    background: "#181830",
                    borderRadius: "14px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={getProfileUrl(person.profile_path)}
                    alt={person.name}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{ margin: 0, fontWeight: "700" }}>{person.name}</p>
                  <p style={{ margin: 0, color: "#bbb", fontSize: "14px" }}>
                    {person.job}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No writer information available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CastCrewPage;