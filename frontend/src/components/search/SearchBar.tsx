import React, { useState, useRef, useEffect } from 'react';

import { Search, X, Clock, Disc, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  className?: string;
}

// 연관 검색어 타입 정의
interface SearchSuggestion {
  type: 'album' | 'artist' | 'recent';
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, className = '' }) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['아이돌', '발라드', '힙합', '인디']);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 임시 연관 검색어 데이터 (실제로는 API에서 가져와야 함)
  const mockSuggestions: SearchSuggestion[] = [
    {
      type: 'album',
      title: 'Butter',
      subtitle: 'BTS',
      imageUrl: '/album-covers/butter.jpg',
    },
    {
      type: 'artist',
      title: 'BTS',
      subtitle: '아티스트',
      imageUrl: '/artist-photos/bts.jpg',
    },
    {
      type: 'album',
      title: 'BE',
      subtitle: 'BTS',
      imageUrl: '/album-covers/be.jpg',
    },
    // ... 더 많은 연관 검색어
  ];

  // 검색어 입력시 연관 검색어 필터링
  useEffect(() => {
    if (query.trim()) {
      // 실제로는 API 호출이 필요
      const filtered = mockSuggestions.filter(
        (suggestion) =>
          suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.subtitle?.toLowerCase().includes(query.toLowerCase()),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

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
    navigate({
      pathname: '/search',
      search: `?q=${encodeURIComponent(suggestion)}`,
    });
    inputRef.current?.blur();
    setIsFocused(false);
  };

  // 검색어 삭제 처리
  const removeSearchTerm = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter((term) => term !== termToRemove));
  };

  // 검색 처리 함수 추가
  const handleSearch = () => {
    if (query.trim()) {
      // 최근 검색어에 추가
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 5));
      }
      // 검색 페이지로 이동하면서 query 파라미터 전달
      navigate({
        pathname: '/search',
        search: `?q=${encodeURIComponent(query.trim())}`,
      });
      setIsFocused(false);
    }
  };

  // 키보드 이벤트 핸들러 추가
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative group">
        {/* 검색창 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-zinc-800/5 rounded-full group-hover:from-amber-500/10 group-hover:to-zinc-800/10 transition-all duration-300"></div>

        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-amber-500" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="노래, 아티스트, 코드를 검색하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          className="w-full py-3 px-4 pl-12 bg-zinc-800/70 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
        />

        {query && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setQuery('')}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 드롭다운 메뉴 수정 */}
      {isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute z-30 left-0 right-0 mt-2 bg-zinc-800/90 backdrop-blur-md rounded-xl shadow-xl border border-white/10 overflow-hidden">
          {/* 연관 검색어 */}
          {suggestions.length > 0 && (
            <div className="py-3">
              <div className="px-4 py-1">
                <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-500" />
                  연관 검색어
                </h4>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion.title)}
                    className="flex items-center px-4 py-3 hover:bg-zinc-700/50 cursor-pointer transition-all group"
                  >
                    {/* 앨범/아티스트 이미지 */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mr-3 group-hover:shadow-md group-hover:shadow-amber-500/10 transition-all">
                      {suggestion.imageUrl ? (
                        <img
                          src={suggestion.imageUrl}
                          alt={suggestion.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-700/80 to-zinc-800/80 flex items-center justify-center">
                          {suggestion.type === 'album' ? (
                            <Disc className="w-5 h-5 text-amber-500" />
                          ) : (
                            <User className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {/* 텍스트 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm truncate group-hover:text-amber-500 transition-colors">
                        {suggestion.title}
                      </div>
                      {suggestion.subtitle && (
                        <div className="text-zinc-400 text-xs truncate">{suggestion.subtitle}</div>
                      )}
                    </div>
                    {/* 타입 표시 */}
                    <div className="text-xs text-amber-500 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {suggestion.type === 'album' ? '앨범' : '아티스트'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="py-3 border-t border-zinc-700/50">
              <div className="px-4 py-1">
                <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  최근 검색어
                </h4>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(term)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-zinc-700/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-zinc-500 mr-3 group-hover:text-amber-500 transition-colors" />
                      <span className="text-zinc-300 group-hover:text-white transition-colors">
                        {term}
                      </span>
                    </div>
                    <button
                      onClick={(e) => removeSearchTerm(term, e)}
                      className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-600/50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
