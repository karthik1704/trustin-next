'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState(new URLSearchParams(window.location.search).get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set('search', query);
    params.set('page', '1');
    router.push(`/dashboard/customers?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit" className='ml-2 inline-flex items-center justify-center rounded-md border border-black px-1 py-1 text-center font-medium text-black hover:bg-opacity-90 dark:border-white dark:text-white lg:px-2 xl:px-2'>Search</button>
    </form>
  );
};

export default Search;
