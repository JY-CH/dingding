import { useState } from 'react';

import { Post } from '@/types/index';

import { CommunityCreate } from '../components/community/CommunityCreate';
import { CommunityDetail } from '../components/community/CommunityDetail';
import { CommunityList } from '../components/community/CommunityList';

// Mock Data (Replace with API calls later)
const mockPosts: Post[] = [
  {
    articleId: 1,
    userId: 1,
    username: 'User1',
    title: 'My Favorite Music',
    content: 'I love listening to music. What is your favorite music?',
    recommend: 10,
    comments: [
      {
        commentId: 1,
        id: 2,
        username: 'User2',
        content: 'I love music too!',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
      {
        commentId: 2,
        id: 3,
        username: 'User3',
        content: 'Me too!',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    ],
    createdAt: new Date(),
    category: 'Music',
    popularPost: false,
  },
  {
    articleId: 2,
    userId: 2,
    username: 'User2',
    title: 'New Technology',
    content: 'I just found a new technology. It is amazing!',
    recommend: 5,
    comments: [
      {
        commentId: 3,
        id: 1,
        username: 'User1',
        content: 'What is it?',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    ],
    createdAt: new Date(),
    category: 'Technology',
    popularPost: false,
  },
];

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleViewDetails = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetails = () => {
    setSelectedPost(null);
  };

  const handleToggleCreate = () => {
    setShowCreate(!showCreate);
  };

  const addNewPost = (newPost: Post) => {
    setPosts([...posts, newPost]);
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Community</h1>
            <h5 className="text-zinc-400"> Welcome To The Community</h5>
          </div>
        </header>

        <button
          onClick={handleToggleCreate}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {showCreate ? 'Back' : 'Create Post'}
        </button>

        {showCreate && <CommunityCreate posts={posts} setPosts={addNewPost} />}

        {!showCreate && !selectedPost ? (
          <div>
            {posts.map((post) => (
              <div onClick={}>
                <CommunityList
                  key={post.articleId} // 고유한 key값
                  post={post} // 개별 포스트 객체를 전달
                />
              </div>
            ))}
          </div>
        ) : null}

        {selectedPost && (
          <CommunityDetail board={selectedPost} handleCloseDetails={handleCloseDetails} />
        )}
      </div>
    </div>
  );
};
