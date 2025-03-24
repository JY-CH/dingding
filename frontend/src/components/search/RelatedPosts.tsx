import React from 'react';

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
      <h4 className="text-lg font-bold text-gray-800 mb-4">연관 게시글</h4>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow hover:bg-amber-50 transition-colors cursor-pointer">
            <img src={post.thumbnail} alt={post.title} className="w-full h-32 object-cover rounded mb-2" />
            <div className="text-sm font-medium">{post.title}</div>
            <div className="text-xs text-gray-500">{post.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
