import { FavoriteMovie } from '@/types/movie';
const STORAGE_KEY = 'favorites';

export function getFavorites(): FavoriteMovie[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save favorites to localStorage
export function saveFavorites(favorites: FavoriteMovie[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Add a movie favorites
export function addFavorite(movie: FavoriteMovie): FavoriteMovie[] {
  const favorites = getFavorites();
  const exists = favorites.find(f => f.id === movie.id);
  if (exists) return favorites;
  
  const newFavorites = [...favorites, { ...movie, addedAt: new Date().toISOString() }];
  saveFavorites(newFavorites);
  return newFavorites;
}

// Remove a movie favorites
export function removeFavorite(movieId: number): FavoriteMovie[] {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(f => f.id !== movieId);
  saveFavorites(newFavorites);
  return newFavorites;
}

// Update rating and note
export function updateFavorite(movieId: number, rating: number, note: string): FavoriteMovie[] {
  const favorites = getFavorites();
  const newFavorites = favorites.map(f =>
    f.id === movieId ? { ...f, personalRating: rating, personalNote: note } : f
  );
  saveFavorites(newFavorites);
  return newFavorites;
}

// Check movie is in favorites
export function isFavorite(movieId: number): boolean {
  return getFavorites().some(f => f.id === movieId);
}
