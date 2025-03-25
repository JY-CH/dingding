import React, { useState } from 'react';

import HotContent from '@/components/search/HotContent';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import SearchTabs from '@/components/search/SearchTabs';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // 검색어 상태 타입 지정
  const [activeTab, setActiveTab] = useState<string>('all'); // 활성 탭 상태 타입 지정

  return (
    <div className="min-h-screen bg-zinc-900">
      <SearchBar query={query} setQuery={setQuery} />
      <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {query.trim() === '' ? (
        <HotContent activeTab={activeTab} />
      ) : (
        <SearchResults activeTab={activeTab} />
      )}
    </div>
  );
};

export default SearchPage;
