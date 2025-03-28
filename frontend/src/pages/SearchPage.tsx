import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import HotContent from '@/components/search/HotContent';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import SearchTabs from '@/components/search/SearchTabs';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<string>('all');

  // URL의 query 파라미터가 변경될 때만 검색어 상태 업데이트
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  return (
    <div className="h-screen bg-zinc-900 overflow-y-auto custom-scrollbar">
      <div className="p-8">
        {/* 검색바 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar query={query} setQuery={setQuery} />
        </motion.div>

        {/* 탭 메뉴 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        {/* 검색 결과 또는 인기 콘텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {searchParams.get('q') ? ( // URL의 query 파라미터 기준으로 검색 결과 표시
            <SearchResults activeTab={activeTab} />
          ) : (
            <HotContent activeTab={activeTab} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
