import React from 'react';

import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => {
  return (
    <div className="px-6 py-4 bg-zinc-900">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-zinc-800 text-white placeholder-gray-400 rounded-full border border-zinc-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default SearchBar;
