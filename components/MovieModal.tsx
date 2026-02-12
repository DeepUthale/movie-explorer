"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Movie, FavoriteMovie } from "@/types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteData?: FavoriteMovie;
  onUpdateFavorite?: (rating: number, note: string) => void;
  onGoToFavorites?: () => void;
}

export default function MovieModal({
  movie,
  onClose,
  isFavorite,
  onToggleFavorite,
  favoriteData,
  onUpdateFavorite,
  onGoToFavorites,
}: MovieModalProps) {
  const [details, setDetails] = useState<Movie>(movie);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(favoriteData?.personalRating || 0);
  const [note, setNote] = useState(favoriteData?.personalNote || "");
  const [hoverStar, setHoverStar] = useState(0);

  // Fetch movie details
  useEffect(() => {
    fetch(`/api/movies/${movie.id}`)
      .then((res) => res.json())
      .then((data) => setDetails(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [movie.id]);

  useEffect(() => {
    setRating(favoriteData?.personalRating || 0);
    setNote(favoriteData?.personalNote || "");
  }, [favoriteData]);

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : null;
  const year = details.release_date
    ? new Date(details.release_date).getFullYear()
    : "N/A";
  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : "N/A";

  const handleRating = (value: number) => {
    setRating(value);
    if (isFavorite && onUpdateFavorite) {
      onUpdateFavorite(value, note);
    }
  };

  const handleNote = (value: string) => {
    setNote(value);
    if (isFavorite && onUpdateFavorite) {
      onUpdateFavorite(rating, value);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{details.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Poster */}
        {posterUrl && (
          <div className="relative h-80 bg-gray-200">
            <Image
              src={posterUrl}
              alt={details.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Movie Info */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4 text-gray-600">
              <span>{year}</span>
              {!loading && <span>{runtime}</span>}
              {details.vote_average > 0 && (
                <span>★ {details.vote_average.toFixed(1)}</span>
              )}
            </div>
            <button
              onClick={onToggleFavorite}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {isFavorite ? "★ Remove" : "☆ Add to Favorites"}
            </button>
          </div>

          {/* Genres */}
          {details.genres && details.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {details.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold mb-2">Overview</h3>
            <p className="text-gray-700">
              {details.overview || "No overview available."}
            </p>
          </div>

          {isFavorite && (
            <div className="border-t pt-6">
              <h3 className="font-bold mb-4">Your Review</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(rating || 1)} 
                      className="text-3xl text-yellow-500"
                    >
                      {star <= (hoverStar || rating || 1) ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Your Notes
                </label>
                <textarea
                  value={note}
                  onChange={(e) => handleNote(e.target.value)}
                  placeholder="Add your personal notes..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={4}
                />
              </div>

              {/* Go to Favorites */}
              <button
                onClick={() => {
                  onClose();
                  onGoToFavorites?.();
                }}
                className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                View All Favorites
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
