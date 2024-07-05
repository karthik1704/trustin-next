import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Search: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: query, page: '1' },
    });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;
