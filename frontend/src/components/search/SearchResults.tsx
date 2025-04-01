import React from 'react';

import { motion } from 'framer-motion';

import RelatedPosts from './RelatedPosts';
import RelatedSongs from './RelatedSongs';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
}

interface SearchResultsProps {
  activeTab: string;
}

// 더미 데이터 예시 (실제 API 또는 상위 컴포넌트에서 받아오도록 변경 가능)
const relatedSongs: Song[] = [
  { id: 101, title: 'Related Song A', artist: 'Artist X', thumbnail: 'src/assets/노래.jpg' },
  { id: 102, title: 'Related Song B', artist: 'Artist Y', thumbnail: 'src/assets/노래.jpg' },
];

const relatedPosts: Post[] = [
  {
    id: 201,
    title: 'Related Post A',
    excerpt: '관련 게시글 내용 요약...',
    thumbnail: 'src/assets/노래.jpg',
  },
  {
    id: 202,
    title: 'Related Post B',
    excerpt: '관련 게시글 내용 요약...',
    thumbnail: 'src/assets/노래.jpg',
  },
];

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

const SearchResults: React.FC<SearchResultsProps> = ({ activeTab }) => {
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
          <RelatedSongs songs={relatedSongs} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <RelatedPosts posts={relatedPosts} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'albums') {
    return (
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <RelatedSongs songs={relatedSongs} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'community') {
    return (
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <RelatedPosts posts={relatedPosts} />
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
