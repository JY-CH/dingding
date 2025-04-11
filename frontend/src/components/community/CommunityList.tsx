// c:\Users\SSAFY\Desktop\jy\J-Project\study\S12P21D105\frontend\src\components\community\CommunityList.tsx
import React from 'react';

import { HiOutlineHeart, HiOutlineChatAlt, HiOutlineClock } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { Post } from '@/types/index';

interface CommunityListProps {
  post: Post;
}

export const CommunityList: React.FC<CommunityListProps> = ({ post }) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}분 전`;
      }
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // 카테고리별 색상 설정
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'practice': 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
      'tips': 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
      'question': 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
      'study': 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
      'default': 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400'
    };
    return categoryColors[category.toLowerCase()] || categoryColors.default;
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 
                 hover:border-zinc-600/50 transition-all duration-300 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="font-medium text-zinc-200">{post.username}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <HiOutlineClock className="w-3 h-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          {post.category && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium 
                          bg-gradient-to-br border ${getCategoryColor(post.category)}`}>
              {post.category}
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-3 text-white/90 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-zinc-400 text-sm mb-6 line-clamp-3">
          {post.content}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors">
              <HiOutlineHeart className={`w-5 h-5 ${post.isLike ? 'fill-amber-400' : ''}`} />
              <span className="text-sm">{post.recommend}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors">
              <HiOutlineChatAlt className="w-5 h-5" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs px-3 py-1 rounded-full bg-zinc-700/50 text-zinc-400 
                     hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-200"
          >
            자세히 보기
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};
