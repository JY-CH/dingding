import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { _axiosAuth } from '../../services/JYapi';

interface CommunityEditProps {
  articleDetail: {
    articleId: number;
    title: string;
    content: string;
    category: string; // 카테고리 추가
  };
  onCancel: () => void; // 수정 취소 핸들러
  onComplete: () => void; // 수정 완료 핸들러
}

export const CommunityEdit: React.FC<CommunityEditProps> = ({
  articleDetail,
  onCancel,
  onComplete,
}) => {
  const [title, setTitle] = useState(articleDetail.title);
  const [content, setContent] = useState(articleDetail.content);
  const [selectedCategory, setSelectedCategory] = useState(articleDetail.category); // 선택된 카테고리 상태
  const queryClient = useQueryClient();

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

  const handleSave = async () => {
    try {
      await _axiosAuth.put(`/article/${articleDetail.articleId}`, {
        title,
        content,
        category: selectedCategory, // 선택된 카테고리 전송
      });
      alert('수정이 완료되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['article', articleDetail.articleId],
      });
      onComplete(); // 수정 완료 후 호출
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white pt-3">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <div className="w-full max-w-2xl space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full p-4 bg-zinc-800 text-white rounded-lg"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="w-full p-4 bg-zinc-800 text-white rounded-lg h-40 resize-none"
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
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
