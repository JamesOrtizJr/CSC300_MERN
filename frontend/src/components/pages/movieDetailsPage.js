import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchLater, setWatchLater] = useState(false);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=ada999e2`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  if (!movie) return <p className="p-6">Loading...</p>;

  if (movie.Response === "False") {
    return <p className="p-6">Movie not found.</p>;
  }

  const yearNumber = parseInt(movie.Year, 10);
  const decadeTag = !isNaN(yearNumber)
    ? `${Math.floor(yearNumber / 10) * 10}s`
    : null;

  return (
    <div className="p-8">
      <div className="flex gap-8 items-stretch">
        {/* Left column */}
        <div className="flex flex-col">
          <div className="w-72 h-[26rem] bg-black rounded-md shadow-md flex items-center justify-center overflow-hidden">
            <img
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <button
            onClick={() => navigate(`/movies/${id}/cast`)}
            className="mt-4 w-72 h-14 border border-black rounded-md text-lg font-medium bg-white hover:bg-gray-100"
          >
            Cast & Crew
          </button>
        </div>

        {/* Right column */}
        <div className="flex-1 h-[30rem] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-3">{movie.Title}</h1>

              <div className="flex flex-wrap gap-2">
                {movie.Genre?.split(", ").map((tag, i) => (
                  <span
                    key={i}
                    className="border border-black px-3 py-1 rounded-md text-sm bg-white"
                  >
                    {tag}
                  </span>
                ))}

                {movie.Runtime && (
                  <span className="border border-black px-3 py-1 rounded-md text-sm bg-white">
                    {movie.Runtime}
                  </span>
                )}

                {movie.Year && (
                  <span className="border border-black px-3 py-1 rounded-md text-sm bg-white">
                    {movie.Year}
                  </span>
                )}

                {decadeTag && (
                  <span className="border border-black px-3 py-1 rounded-md text-sm bg-white">
                    {decadeTag}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-4 min-w-[170px] items-start">
              <button
                onClick={() => setWatchLater(!watchLater)}
                className="flex items-center gap-2 text-sm font-medium bg-transparent border-none p-0 hover:opacity-70"
              >
                <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-sm leading-none bg-white">
                  {watchLater ? "−" : "+"}
                </span>
                <span>Watch Later</span>
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center gap-2 text-sm font-medium bg-transparent border-none p-0 hover:opacity-70"
              >
                <span
                  className={`text-xl leading-none ${
                    isFavorite ? "text-yellow-400" : "text-white"
                  }`}
                  style={{ WebkitTextStroke: "1px black" }}
                >
                  ★
                </span>
                <span>Favorite</span>
              </button>
            </div>
          </div>

          {/* Lower section */}
          <div className="mt-10 flex gap-6 flex-1 min-h-0">
            <div className="flex-1 border border-black rounded-md p-5 bg-white flex flex-col overflow-hidden">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="overflow-y-auto">
                <p className="leading-relaxed">{movie.Plot}</p>
              </div>
            </div>

            <div className="flex-1 border border-black rounded-md p-5 bg-white flex flex-col overflow-hidden">
              <h2 className="text-xl font-semibold mb-3">Comments</h2>

              <div className="text-gray-500 mb-4 overflow-y-auto">
                No comments yet.
              </div>

              <div className="mt-auto">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="border border-gray-400 rounded-md p-2 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;