import React from 'react';

import { FileText, MessageSquare, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SearchCommunityPost } from '../../types/index';

interface RelatedPostsProps {
  posts: SearchCommunityPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const navigate = useNavigate();
  const handlePostClick = (postId: number) => {
    navigate(`/community`, { state: { articleId: postId } });
  };
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-bold text-white">관련 게시글</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <button onClick={() => handlePostClick(post.articleId)} key={post.articleId}>
            <div
              key={post.articleId}
              className="bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/80 border border-white/5 hover:border-amber-500/30 rounded-xl overflow-hidden group transition-all h-full flex flex-col"
            >
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex flex-row gap-3 items-center mb-2">
                  <h3 className="text-white font-semibold group-hover:text-amber-500 transition-colors items-center">
                    <span>{post.title}</span>
                  </h3>
                  <div className="bg-gray-700 rounded-full px-3 py-1 text-sm text-gray-300">
                    <span className="text-gray-500">{post.category}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.recommend}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
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
