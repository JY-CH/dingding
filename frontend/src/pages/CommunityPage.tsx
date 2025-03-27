// c:\Users\SSAFY\Desktop\jy\J-Project\study\S12P21D105\frontend\src\pages\CommunityPage.tsx
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Post, Comment } from '@/types/index';

import { CommunityCreate } from '../components/community/CommunityCreate';
import { CommunityList } from '../components/community/CommunityList';

// Mock Data (Replace with API calls later)

interface Comment {
  id: number;
  author: string;
  content: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: 'User1',
    title: 'My Favorite Music',
    content: 'I love listening to music. What is your favorite music?',
    likes: 10,
    comments: [
      { id: 1, author: 'User2', content: 'I love music too!' },
      { id: 2, author: 'User3', content: 'Me too!' },
    ],
    createdAt: new Date(),
  },
  {
    id: 2,
    author: 'User2',
    title: 'New Technology',
    content: 'I just found a new technology. It is amazing!',
    likes: 5,
    comments: [{ id: 3, author: 'User1', content: 'What is it?' }],
    createdAt: new Date(),
  },
];

export const CommunityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showCreate, setShowCreate] = useState(false); // New state variable
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (postId: number) => {
    navigate(`/community/detail/${postId}`, { state: { postId } });
  };

  const handleToggleCreate = () => {
    setShowCreate(!showCreate); // Toggle the showCreate state
  };

  // Function to add a new post
  const addNewPost = (newPost: Post) => {
    setPosts([...posts, newPost]);
    setShowCreate(false); // Hide the create form after adding the post
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Community</h1>
            <h5 className="text-zinc-400"> Welcome To The Community</h5>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              className="py-2 px-4 pl-10 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-amber-500 w-64 transition-all"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </header>

        {/* Toggle Create Button */}
        <button
          onClick={handleToggleCreate}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {showCreate ? 'Back' : 'Create Post'}
        </button>

        {/* Create Post Section (Conditionally Rendered) */}
        {showCreate && <CommunityCreate posts={posts} setPosts={addNewPost} />}

        {/* Posts Section */}
        {!showCreate && <CommunityList posts={posts} handleViewDetails={handleViewDetails} />}
      </div>
    </div>
  );
};
