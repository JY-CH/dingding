import React from 'react';

import { motion } from 'framer-motion';
import { MessageSquare, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommunityPost } from '@/types/index';

interface PopularPostsProps {
  posts: CommunityPost[];
}

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  const navigate = useNavigate();
  const handlePostClick = (postId: number) => {
    navigate(`/community`, { state: { articleId: postId } });
  };
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-4"
      >
        <MessageSquare className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-white">인기 게시글</h3>
      </motion.div>
      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        {posts.map((post) => (
          <motion.div
            key={post.articleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
            role="button" // 접근성을 위한 역할 추가
            tabIndex={0} // 키보드 접근성을 위한 tabIndex 추가
            onClick={() => handlePostClick(post.articleId)} // 클릭 이벤트 추가
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                console.log(`Post clicked via keyboard: ${post.articleId}`);
              }
            }} // 키보드 이벤트 추가
          >
            <div className="flex items-center">
              <div className="ml-4 flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{post.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <UserCircle className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{post.username}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="w-16 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                {/* 썸네일이 없을 경우 대체 UI */}
                {post.category ? (
                  <span className="text-xs text-gray-400 truncate max-w-full">{post.category}</span>
                ) : (
                  <span className="text-xs text-gray-400 truncate max-w-full">No Image</span>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-300 line-clamp-2"></div>

            <div className="ml-4 mt-2 text-xs text-amber-500">추천 수: {post.recommend || 0}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
