import React from 'react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
}

interface HotPostsProps {
  posts: Post[];
}

const HotPosts: React.FC<HotPostsProps> = ({ posts }) => {
  return (
    <div>
      <h2 className="text-white text-xl font-bold mb-4">🔥 핫한 게시글</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center space-x-4">
            <img src={post.thumbnail} alt={post.title} className="w-16 h-16 rounded-lg" />
            <div>
              <p className="text-white font-semibold">{post.title}</p>
              <p className="text-gray-400 text-sm">{post.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotPosts;
