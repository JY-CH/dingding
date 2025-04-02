import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/services/JYapi'; // 실제 API 요청을 위한 axios 인스턴스

export const CommunityCreate = () => {
  const navigate = useNavigate();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리 상태
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

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCategory) {
        throw new Error('Please select a category.');
      }
      const response = await _axiosAuth.post('/article', {
        title: newPostTitle,
        content: newPostContent,
        category: selectedCategory,
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Post created successfully!');
      window.location.reload(); // 페이지 새로고침
      // navigate('/community'); // 게시글 생성 후 커뮤니티 페이지로 이동
    },
    onError: (error: any) => {
      console.error('Failed to create post:', error.response?.data || error.message);
      alert('Failed to create post. Please try again.');
    },
  });

  const handleCreatePost = () => {
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      alert('Please fill in both title and content.');
      return;
    }
    createPostMutation.mutate(); // 게시글 생성 요청
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
        <div className="flex flex-wrap gap-2 mb-4">
          {mockCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCreatePost}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={createPostMutation.isLoading} // 로딩 중 버튼 비활성화
          >
            {createPostMutation.isLoading ? 'Creating...' : 'Post'}
          </button>
          <button
            onClick={handleGoBack}
            className="bg-zinc-600 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </section>
    </div>
  );
};
