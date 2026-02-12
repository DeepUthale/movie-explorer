'use client';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import { Movie, FavoriteMovie, SearchResponse } from '@/types/movie';
import * as favStorage from '@/lib/favorites';

export default function Home() {
  // State
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(favStorage.getFavorites());
  }, []);

  // Search movies
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setActiveTab('search');

    try {
      const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      
      const data: SearchResponse = await res.json();
      setSearchResults(data.results);
      
      if (data.results.length === 0) {
        setError('No movies found. Try a different search.');
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (movie: Movie) => {
    if (favStorage.isFavorite(movie.id)) {
      const updated = favStorage.removeFavorite(movie.id);
      setFavorites(updated);
    } else {
      const updated = favStorage.addFavorite({ ...movie, addedAt: new Date().toISOString(), personalRating: 1 });
      setFavorites(updated);
    }
  };

  // Update favorite rating/note
  const handleUpdateFavorite = (movieId: number, rating: number, note: string) => {
    const updated = favStorage.updateFavorite(movieId, rating, note);
    setFavorites(updated);
  };

  // Determine which movies to display
  const movies = activeTab === 'favorites' ? favorites : searchResults;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Movie Explorer</h1>
          <p className="text-gray-600">Search, discover, and save your favorite movies</p>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'search'
                ? 'bg-black text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Search Results
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'favorites'
                ? 'bg-black text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Searching movies...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {activeTab === 'favorites'
                ? 'No favorites yet, Search and add some movies!'
                : hasSearched
                ? 'No results found'
                : 'Search for a movies to get started'}
            </p>
          </div>
        )}

        {/* Movie Grid */}
        {!isLoading && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
                showDetails={activeTab === 'favorites'}
              />
            ))}
          </div>
        )}

        {/* Movie Modal */}
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            isFavorite={favStorage.isFavorite(selectedMovie.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedMovie)}
            favoriteData={favorites.find((f) => f.id === selectedMovie.id)}
            onUpdateFavorite={(rating, note) => handleUpdateFavorite(selectedMovie.id, rating, note)}
            onGoToFavorites={() => setActiveTab('favorites')}
          />
        )}
      </div>
    </main>
  );
}
