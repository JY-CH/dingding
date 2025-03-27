// c:\Users\SSAFY\Desktop\jy\J-Project\study\S12P21D105\frontend\src\components\community\CommunityList.tsx
import React from 'react';

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
}

interface CommunityListProps {
  posts: Post[];
  handleViewDetails: (postId: number) => void;
}

export const CommunityList: React.FC<CommunityListProps> = ({ posts, handleViewDetails }) => {
  console.log(posts);
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Posts</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{post.title}</h3>
            <span className="text-sm text-zinc-400">by {post.author}</span>
          </div>
          <p className="mb-4">{post.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleViewDetails(post.id)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};
