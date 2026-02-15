"use client";
import Image from "next/image";
import { Movie, FavoriteMovie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie | FavoriteMovie;
  onClick: () => void;
  showDetails?: boolean;
}

export default function MovieCard({
  movie,
  onClick,
  showDetails,
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const favorite = showDetails ? (movie as FavoriteMovie) : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-200">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}

        <button
          onClick={onClick}
          className="absolute bottom-2 right-2 px-3 py-1.5 bg-white text-black text-sm font-semibold rounded-lg shadow-lg hover:bg-gray-300"
        >
          Details
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{year}</p>
        <p className="text-sm text-gray-700 line-clamp-2">{movie.overview}</p>

        {/* Show rating and note for favorites */}
        {showDetails && favorite?.personalRating && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-medium">Rating:</span>
              <span className="text-yellow-500 text-2xl">
                {"★".repeat(favorite.personalRating)}
                {"☆".repeat(5 - favorite.personalRating)}
              </span>
            </div>
            <span className="text-sm font-medium">Your Notes:</span>
            {favorite.personalNote && (
              <p className="text-base text-gray-600 italic">
                {favorite.personalNote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
