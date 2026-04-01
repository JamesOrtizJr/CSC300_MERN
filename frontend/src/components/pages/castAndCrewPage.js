import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CastCrewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=ada999e2`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error fetching cast data:", err));
  }, [id]);

  if (!movie) return <p className="p-6">Loading...</p>;

  if (movie.Response === "False") {
    return <p className="p-6">Movie not found.</p>;
  }

  const actors = movie.Actors ? movie.Actors.split(", ") : [];
  const directors = movie.Director ? movie.Director.split(", ") : [];
  const writers = movie.Writer ? movie.Writer.split(", ") : [];

  return (
    <div className="p-6">
  {/* Back Button */}
  <button
    onClick={() => navigate(`/movies/${id}`)}
    className="mb-4 border border-black rounded-md px-3 py-2 bg-white hover:bg-gray-100 text-sm"
  >
    Back to Movie
  </button>

  {/* Title */}
  <h1 className="text-5xl font-bold mb-4">
    {movie.Title} Cast & Crew
  </h1>

  {/* Three sections side-by-side */}
  <div className="flex gap-4">
    
    {/* ACTORS */}
    <div className="flex-1 border border-black rounded-md p-4 bg-white">
      <h2 className="text-2xl font-semibold mb-2">Actors</h2>

      {actors.length > 0 ? (
        <ul className="list-disc pl-5 text-lg leading-relaxed">
          {actors.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">No actor information available.</p>
      )}
    </div>

    {/* DIRECTOR */}
    <div className="flex-1 border border-black rounded-md p-4 bg-white">
      <h2 className="text-2xl font-semibold mb-2">Director</h2>

      {directors.length > 0 ? (
        <ul className="list-disc pl-5 text-lg leading-relaxed">
          {directors.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">No director information available.</p>
      )}
    </div>

    {/* WRITERS */}
    <div className="flex-1 border border-black rounded-md p-4 bg-white">
      <h2 className="text-2xl font-semibold mb-2">Writers</h2>

      {writers.length > 0 ? (
        <ul className="list-disc pl-5 text-lg leading-relaxed">
          {writers.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">No writer information available.</p>
      )}
    </div>

  </div>
</div>
  );
}

export default CastCrewPage;