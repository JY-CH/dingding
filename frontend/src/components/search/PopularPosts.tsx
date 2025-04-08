import React from 'react';

import { motion } from 'framer-motion';
import { MessageSquare, UserCircle } from 'lucide-react';

import { CommunityPost } from '@/types/index';

interface PopularPostsProps {
  posts: CommunityPost[];
}

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  console.log(posts, '씨발');
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
            transition={{ delay: 0.8 }}
            className="p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                {/* 썸네일이 없을 경우 대체 UI */}
                {post.category ? (
                  <span className="text-xs text-gray-400">{post.category}</span>
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                )}
              </div>
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
            </div>
            <div className="mt-2 text-xs text-gray-300 line-clamp-2">
              {post.content ? post.content.slice(0, 100) : '내용이 없습니다.'}
            </div>
            {post.isLike && (
              <div className="mt-2 text-xs text-amber-500">추천 수: {post.recommend || 0}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
