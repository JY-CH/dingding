import React from 'react';

import { MessageSquareText } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-orange-500" />
          <h4 className="text-lg font-bold text-white">연관 게시글</h4>
        </div>
        <button className="text-sm text-orange-500">모두 보기</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-800 p-4 rounded-xl shadow hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div className="text-sm font-medium text-white truncate">{post.title}</div>
            <div className="text-xs text-gray-400 line-clamp-2">{post.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
