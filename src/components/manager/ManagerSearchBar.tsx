import React, { useState } from 'react';

interface ManagerSearchBarProps {
  onSearch: (filters: any) => void;
}

export const ManagerSearchBar: React.FC<ManagerSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar manager por nombre..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <button type="submit" className="btn btn-primary">
        Buscar
      </button>
    </form>
  );
};
