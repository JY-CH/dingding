import React from 'react';

import { motion } from 'framer-motion';

import RelatedPosts from './RelatedPosts';
import RelatedSongs from './RelatedSongs';
import { SearchSong, SearchCommunityPost } from '../../types';

interface SearchResultsProps {
  activeTab: string;
  searchCommunity: SearchCommunityPost[];
  searchSongs: SearchSong[];
}

// 더미 데이터 예시 (실제 API 또는 상위 컴포넌트에서 받아오도록 변경 가능)

// 애니메이션 설정
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const SearchResults: React.FC<SearchResultsProps> = ({
  activeTab,
  searchCommunity,
  searchSongs,
}) => {
  console.log(searchCommunity, 'asdasdsad');
  console.log(searchSongs);
  // activeTab에 따라 표시할 콘텐츠를 전환합니다.
  if (activeTab === 'all') {
    return (
      <motion.div
        className="p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <RelatedSongs songs={searchSongs} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <RelatedPosts posts={searchCommunity} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'albums') {
    return (
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <RelatedSongs songs={searchSongs} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'community') {
    return (
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <RelatedPosts posts={searchCommunity} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'artists') {
    return (
      <motion.div
        className="p-6 flex items-center justify-center h-64"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="p-6 bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-white/5"
        >
          <p className="text-zinc-300 text-center">관련 데이터가 없습니다.</p>
        </motion.div>
      </motion.div>
    );
  }

  return null;
};

export default SearchResults;
