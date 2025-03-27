import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { CommunityCreate } from '../components/community/CommunityCreate';
// Mock Data (Replace with API calls later)
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
  },
  {
    id: 2,
    author: 'User2',
    title: 'New Technology',
    content: 'I just found a new technology. It is amazing!',
    likes: 5,
    comments: [{ id: 3, author: 'User1', content: 'What is it?' }],
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
    navigate(`/community/detail/${postId}`);
  };

  const handleToggleCreate = () => {
    setShowCreate(!showCreate); // Toggle the showCreate state
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-full bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white p-8">
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
          {showCreate ? 'Hide Create' : 'Create Post'}
        </button>

        {/* Create Post Section (Conditionally Rendered) */}
        {showCreate && <CommunityCreate posts={posts} setPosts={setPosts} />}

        {/* Posts Section */}
        {!showCreate && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Posts</h2>
            {filteredPosts.map((post) => (
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
        )}
      </div>
    </div>
  );
};
