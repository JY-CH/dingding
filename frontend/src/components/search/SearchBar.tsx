import React, { useState, useRef, useEffect } from 'react';

import { Search, X, Clock } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['아이돌', '발라드', '힙합', '인디']);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색창 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색어 선택 처리
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.blur();
  };

  // 검색어 삭제 처리
  const removeSearchTerm = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter((term) => term !== termToRemove));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="px-6 py-4 bg-zinc-900">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="검색어를 입력하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full py-2 pl-10 pr-4 bg-zinc-800 text-white placeholder-gray-400 rounded-full border border-zinc-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
          />

          {query && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
              onClick={() => setQuery('')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 검색어 드롭다운 - 세로로 길게 표시 */}
      {isFocused && recentSearches.length > 0 && (
        <div className="absolute z-10 left-6 right-6 mt-1 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2">
              <h4 className="text-sm font-medium text-gray-300">최근 검색어</h4>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectSuggestion(term)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-200">{term}</span>
                  </div>
                  <button
                    onClick={(e) => removeSearchTerm(term, e)}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
