// c:\Users\SSAFY\Desktop\jy\J-Project\study\S12P21D105\frontend\src\components\community\CommunityList.tsx
import React from 'react';

import lickeIcon from '@/assets/like.svg'; // 필요한 경로로 조정하세요
import { CommunityPost } from '@/types/index';

interface CommunityListProps {
  post: CommunityPost;
}

export const CommunityList: React.FC<CommunityListProps> = ({ post }) => {
  console.log(post);
  return (
    <section>
      {/* <h2 className="text-xl font-semibold">Posts</h2> */}

      <div
        key={post.articleId}
        className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-lg font-medium">{post.title}</h3>
            <div className="bg-gray-700 rounded-full px-3 py-1 text-sm text-gray-300">
              <span className="text-gray-500">{post.category}</span>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <span className="text-sm text-zinc-400">{post.username}</span>
          </div>
        </div>
        <p className="mb-10">{post.content}</p>
        <div className="flex items-end justify-between">
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm text-zinc-400">
              <img src={lickeIcon} alt="" />
            </span>
            {post.recommend}
          </div>
          <div className="text-zinc-400">{post.createdAt.replace('T', ' ').slice(0, 16)}</div>
        </div>
      </div>
    </section>
  );
};
