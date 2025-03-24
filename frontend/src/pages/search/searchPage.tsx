import React, { useState } from 'react';

import HotContent from '@/components/search/HotContent';
import SearchBar from '@/components/search/SearchBar';
// import SearchResults from '@/components/search/SearchResults';
// import SearchSuggestions from '@/components/search/SearchSuggestions';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-amber-50">
      <SearchBar query={query} setQuery={setQuery} />

      {query.trim() === '' ? (
        <>
          <HotContent />
        </>
      ) : (
        <HotContent />
      )}
    </div>
  );
};

export default SearchPage;
