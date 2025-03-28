import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Disc, User } from 'lucide-react';

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
      imageUrl: '/album-covers/butter.jpg'
    },
    {
      type: 'artist',
      title: 'BTS',
      subtitle: '아티스트',
      imageUrl: '/artist-photos/bts.jpg'
    },
    {
      type: 'album',
      title: 'BE',
      subtitle: 'BTS',
      imageUrl: '/album-covers/be.jpg'
    },
    // ... 더 많은 연관 검색어
  ];

  // 검색어 입력시 연관 검색어 필터링
  useEffect(() => {
    if (query.trim()) {
      // 실제로는 API 호출이 필요
      const filtered = mockSuggestions.filter(
        suggestion => 
          suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.subtitle?.toLowerCase().includes(query.toLowerCase())
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
      search: `?q=${encodeURIComponent(suggestion)}`
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
        setRecentSearches(prev => [query.trim(), ...prev].slice(0, 5));
      }
      // 검색 페이지로 이동하면서 query 파라미터 전달
      navigate({
        pathname: '/search',
        search: `?q=${encodeURIComponent(query.trim())}`
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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search for songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          className="py-2 px-4 pl-10 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 w-full transition-all"
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

      {/* 드롭다운 메뉴 수정 */}
      {isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 overflow-hidden">
          {/* 연관 검색어 */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2">
                <h4 className="text-sm font-medium text-gray-300">연관 검색어</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion.title)}
                    className="flex items-center px-4 py-3 hover:bg-zinc-700 cursor-pointer transition-colors"
                  >
                    {/* 앨범/아티스트 이미지 */}
                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-3">
                      {suggestion.imageUrl ? (
                        <img 
                          src={suggestion.imageUrl} 
                          alt={suggestion.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                          {suggestion.type === 'album' ? (
                            <Disc className="w-5 h-5 text-zinc-500" />
                          ) : (
                            <User className="w-5 h-5 text-zinc-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {/* 텍스트 정보 */}
                    <div className="flex-1">
                      <div className="text-white text-sm">{suggestion.title}</div>
                      {suggestion.subtitle && (
                        <div className="text-zinc-400 text-xs">{suggestion.subtitle}</div>
                      )}
                    </div>
                    {/* 타입 표시 */}
                    <div className="text-xs text-zinc-500 px-2 py-1 rounded-full bg-zinc-700/50">
                      {suggestion.type === 'album' ? '앨범' : '아티스트'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 최근 검색어 - 기존 코드 수정 */}
          {recentSearches.length > 0 && (
            <div className="py-2 border-t border-zinc-700">
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
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
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
