import React from 'react';

import { FileText, MessageSquare, ThumbsUp } from 'lucide-react';

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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-bold text-white">관련 게시글</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/80 border border-white/5 hover:border-amber-500/30 rounded-xl overflow-hidden group transition-all h-full flex flex-col"
          >
            <div className="relative w-full h-32 overflow-hidden">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent opacity-60"></div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-white font-semibold mb-2 group-hover:text-amber-500 transition-colors">
                {post.title}
              </h3>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
              <div className="flex justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>23</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>48</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && (
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-white/5 rounded-lg p-6 text-center">
          <p className="text-zinc-400">관련 게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedPosts;
