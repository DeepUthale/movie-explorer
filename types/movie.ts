export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface FavoriteMovie extends Movie {
  personalRating?: number;
  personalNote?: string;
  addedAt: string;
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
