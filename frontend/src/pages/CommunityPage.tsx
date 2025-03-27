import React, { useState } from 'react';

// Mock Data (Replace with API calls later)
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
    comments: [
      { id: 3, author: 'User1', content: 'What is it?' },
    ],
  },
];

export const CommunityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreatePost = () => {
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      alert('Please fill in both title and content.');
      return;
    }

    const newPost: Post = {
      id: posts.length + 1,
      author: 'CurrentUser', // Replace with actual current user
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      comments: [],
    };

    setPosts([...posts, newPost]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handleAddComment = (postId: number, commentContent: string) => {
    const newComment: Comment = {
      id: posts.find((post) => post.id === postId)!.comments.length + 1,
      author: 'CurrentUser', // Replace with actual current user
      content: commentContent,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post,
      ),
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
            <div className='flex flex-col'>
                <h1 className="text-3xl font-bold">Community</h1>
                <h5 className='text-zinc-400'> Welcome To The Community</h5>
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

        <div>
            {/* 여긴 커뮤니티생성 버튼이 들어갈 예정 */}
        </div>

        {/* Posts Section */}
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
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-sm hover:text-amber-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {post.likes}
                </button>
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  {post.comments.length}
                </div>
              </div>
              {/* Comments */}
              <div className="mt-4 space-y-2">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-zinc-700/50 backdrop-blur-sm border border-white/10 rounded-lg p-3"
                  >
                    <p className="text-sm font-medium">{comment.author}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
                {/* Add Comment */}
                <div className="mt-2p">
                  <AddComment
                    postId={post.id}
                    handleAddComment={handleAddComment}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

interface AddCommentProps {
  postId: number;
  handleAddComment: (postId: number, commentContent: string) => void;
}

const AddComment: React.FC<AddCommentProps> = ({
  postId,
  handleAddComment,
}) => {
  const [commentContent, setCommentContent] = useState('');

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCommentContent(event.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentContent.trim() === '') {
      alert('Please enter a comment.');
      return;
    }
    handleAddComment(postId, commentContent);
    setCommentContent('');
  };

  return (
    <div className="flex items-start gap-2 ">
      <textarea
        className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
        placeholder="Add a comment..."
        value={commentContent}
        onChange={handleCommentChange}
      />
      <button
        onClick={handleCommentSubmit}
        className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Send
      </button>
    </div>
  );
};
