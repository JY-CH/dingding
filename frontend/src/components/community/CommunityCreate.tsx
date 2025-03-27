import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Post } from '@/types/index';

interface CommunityCreateProps {
  posts: Post[];
  setPosts: (newPost: Post) => void; // Change the type of setPosts
}

export const CommunityCreate: React.FC<CommunityCreateProps> = ({ posts, setPosts }) => {
  const navigate = useNavigate();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const mockCategories = [
    'Music',
    'Technology',
    'Sports',
    'News',
    'Comedy',
    'Education',
    'True Crime',
    'Society & Culture',
  ];

  const handleCreatePost = () => {
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      alert('Please fill in both title and content.');
      return;
    }
    // 임시 데이터
    const newPost: Post = {
      articleId: posts.length + 1,
      userId: 1,
      username: 'CurrentUser',
      title: newPostTitle,
      content: newPostContent,
      createdAt: new Date(), // Add createAt
      category: 'Music',
      popular_post: false,
      recommend: 3,
    };

    setPosts(newPost); // Call the setPosts function with the new post
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleGoBack = () => {
    navigate('/community');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create</h2>
      <section className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-500 mb-4"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Post Content"
          className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-500 mb-4 h-32 resize-none"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleCreatePost}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Post
          </button>
          <button
            onClick={handleGoBack}
            className="bg-zinc-600 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {mockCategories.map((category) => (
            <button
              key={category}
              className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
