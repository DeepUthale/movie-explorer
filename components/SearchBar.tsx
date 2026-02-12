'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
