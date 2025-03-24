import React from 'react';

const SearchSuggestions: React.FC = () => {
  const suggestions = ['아이돌', '발라드', '힙합', '인디'];
  return (
    <div className="px-6 py-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">최근 검색어</h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((word, index) => (
          <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
