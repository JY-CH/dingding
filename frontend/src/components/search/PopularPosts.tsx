import React from 'react';

import { MessageSquare, UserCircle } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  author?: string;
  date?: string;
  likes?: number;
}

interface PopularPostsProps {
  posts: Post[];
}

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-white">인기 게시글</h3>
      </div>
      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
          >
            <div className="flex items-center">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="ml-4 flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{post.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <UserCircle className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{post.author}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-300 line-clamp-2">{post.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
