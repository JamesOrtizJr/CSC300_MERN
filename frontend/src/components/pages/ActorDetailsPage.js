import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const TMDB_API_KEY = "b794dfff76239d4deb38d526dc781cd7";
const PRIMARY_COLOR = "#d40a0a";
const SECONDARY_COLOR = "#0c0c1f";
const CARD_COLOR = "#181830";

function ActorDetailsPage() {
  const { actorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backPath = location.state?.from || "/homepage1";

  const getProfileUrl = (profilePath) => {
    return profilePath
      ? `https://image.tmdb.org/t/p/w500${profilePath}`
      : "https://via.placeholder.com/300x450?text=No+Image";
  };

  const getPosterUrl = (posterPath) => {
    return posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : "https://via.placeholder.com/300x450?text=No+Poster";
  };

  const actorMovies = useMemo(() => {
    return [...movies]
      .filter((movie) => movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity);
  }, [movies]);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [actorRes, creditsRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/person/${actorId}?api_key=${TMDB_API_KEY}&language=en-US`
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`
          ).then((res) => res.json()),
        ]);

        if (actorRes.success === false || creditsRes.success === false) {
          setError("Actor not found.");
          return;
        }

        setActor(actorRes);
        setMovies(creditsRes.cast || []);
      } catch (err) {
        console.error("Error fetching actor details:", err);
        setError("Could not load actor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [actorId]);

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
        <p>Loading actor details...</p>
      </div>
    );
  }

  if (error || !actor) {
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
          onClick={() => navigate(backPath)}
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
          Back to Cast & Crew
        </button>

        <p>{error || "Actor not found."}</p>
      </div>
    );
  }

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
        onClick={() => navigate(backPath)}
        style={{
          marginBottom: "24px",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          background: PRIMARY_COLOR,
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Back to Cast & Crew
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "28px",
          alignItems: "start",
          marginBottom: "40px",
        }}
      >
        <img
          src={getProfileUrl(actor.profile_path)}
          alt={actor.name}
          style={{
            width: "100%",
            height: "420px",
            objectFit: "cover",
            borderRadius: "14px",
          }}
        />

        <div>
          <h1 style={{ fontSize: "42px", fontWeight: "700" }}>
            {actor.name}
          </h1>

          <p style={{ color: "#bbb" }}>
            <strong>Known For:</strong>{" "}
            {actor.known_for_department || "N/A"}
          </p>

          <p style={{ color: "#bbb" }}>
            <strong>Birthday:</strong> {actor.birthday || "N/A"}
          </p>

          <p style={{ color: "#bbb" }}>
            <strong>Place of Birth:</strong> {actor.place_of_birth || "N/A"}
          </p>

          <h3 style={{ marginTop: "24px" }}>Biography</h3>
          <p style={{ lineHeight: "1.7", color: "#ddd" }}>
            {actor.biography || "No biography available."}
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: "30px", marginBottom: "18px" }}>
        Movies Featuring {actor.name}
      </h2>

      {actorMovies.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          {actorMovies.map((movie) => (
            <div
              key={movie.credit_id}
              onClick={() => navigate(`/movies/${movie.id}`)}
              style={{
                background: CARD_COLOR,
                borderRadius: "14px",
                padding: "12px",
                cursor: "pointer",
              }}
            >
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />

              <p style={{ margin: "0 0 6px 0", fontWeight: "700" }}>
                {movie.title}
              </p>

              <p style={{ margin: 0, color: "#bbb", fontSize: "14px" }}>
                {movie.character ? `as ${movie.character}` : "Role unavailable"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No movie information available.</p>
      )}
    </div>
  );
}

export default ActorDetailsPage;