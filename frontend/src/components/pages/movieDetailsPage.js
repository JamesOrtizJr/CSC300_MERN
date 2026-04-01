import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchLater, setWatchLater] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [showAuthPopup, setShowAuthPopup] = useState(false);

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

  const requireLogin = (action) => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }

    action();
  };

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
            {/* Title + tags */}
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

            {/* Actions */}
            <div className="flex flex-col items-end min-w-[280px]">
              {/* Watch Later + Favorite */}
              <div className="flex gap-6 mb-3">
                <button
                  onClick={() =>
                    requireLogin(() => setWatchLater(!watchLater))
                  }
                  className="flex items-center gap-2 text-lg font-medium hover:opacity-70"
                >
                  <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-sm bg-white">
                    {watchLater ? "−" : "+"}
                  </span>
                  Watch Later
                </button>

                <button
                  onClick={() =>
                    requireLogin(() => setIsFavorite(!isFavorite))
                  }
                  className="flex items-center gap-2 text-lg font-medium hover:opacity-70"
                >
                  <span
                    className={`text-2xl ${
                      isFavorite ? "text-yellow-400" : "text-white"
                    }`}
                    style={{ WebkitTextStroke: "1px black" }}
                  >
                    ★
                  </span>
                  Favorite
                </button>
              </div>

              {/* Rating */}
              <div
                className="flex gap-1 justify-center w-full"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoverRating || rating);

                  return (
                    <button
                      key={star}
                      onClick={() => requireLogin(() => setRating(star))}
                      onMouseEnter={() => setHoverRating(star)}
                      className="text-[2rem] transition-transform duration-150 hover:scale-110"
                    >
                      <span
                        className={`${
                          isActive ? "text-yellow-400" : "text-white"
                        }`}
                        style={{ WebkitTextStroke: "1px black" }}
                      >
                        ★
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom section */}
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

      {/* Auth popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-[26rem] text-center">
            <h2 className="text-2xl font-semibold mb-3">Sign in required</h2>
            <p className="mb-6 text-gray-700">
              You need to sign in to add movies to your watch list, favorite
              movies, or leave a rating.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="border border-black rounded-md px-4 py-2 bg-yellow-200 hover:bg-yellow-300"
              >
                Sign In
              </button>

              <button
                onClick={() => setShowAuthPopup(false)}
                className="border border-black rounded-md px-4 py-2 bg-white hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetailsPage;