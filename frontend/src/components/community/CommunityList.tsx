// c:\Users\SSAFY\Desktop\jy\J-Project\study\S12P21D105\frontend\src\components\community\CommunityList.tsx
import React from 'react';

import { Post } from '@/types/index';

interface CommunityListProps {
  post: Post;
}

export const CommunityList: React.FC<CommunityListProps> = ({ post }) => {
  console.log(post);
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Posts</h2>

      <div
        key={post.articleId}
        className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{post.title}</h3>
          <span className="text-sm text-zinc-400">by {post.username}</span>
        </div>
        <p className="mb-10">{post.content}</p>
        <div className="flex items-end justify-between">
          <button
            onClick={() => handleViewDetails(post.articleId)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View Details
          </button>
          <div className="text-zinc-400">
            {post.createdAt.toISOString().replace('T', ' ').slice(0, 16)}
          </div>
        </div>
      </div>
    </section>
  );
};
