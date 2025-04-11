import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { HiOutlineMusicNote, HiOutlineLightBulb, HiOutlineChat, HiOutlineAcademicCap } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { _axiosAuth } from '../../services/JYapi';

interface CommunityEditProps {
  articleDetail: {
    articleId: number;
    title: string;
    content: string;
    category: string;
  };
  onCancel: () => void;
  onComplete: () => void;
}

export const CommunityEdit: React.FC<CommunityEditProps> = ({
  articleDetail,
  onCancel,
  onComplete,
}) => {
  const [title, setTitle] = useState(articleDetail.title);
  const [content, setContent] = useState(articleDetail.content);
  const [selectedCategory, setSelectedCategory] = useState(articleDetail.category);
  const [charCount, setCharCount] = useState(articleDetail.content.length);
  const queryClient = useQueryClient();

  const categories = [
    {
      id: 'practice',
      name: '연습 일지',
      icon: <HiOutlineMusicNote className="w-5 h-5" />,
      description: '나만의 연습 경험을 공유해요',
      color: 'blue'
    },
    {
      id: 'tips',
      name: '연주 팁',
      icon: <HiOutlineLightBulb className="w-5 h-5" />,
      description: '실력 향상을 위한 꿀팁',
      color: 'green'
    },
    {
      id: 'question',
      name: '질문하기',
      icon: <HiOutlineChat className="w-5 h-5" />,
      description: '궁금한 점을 물어보세요',
      color: 'purple'
    },
    {
      id: 'study',
      name: '스터디',
      icon: <HiOutlineAcademicCap className="w-5 h-5" />,
      description: '함께 성장하는 스터디',
      color: 'amber'
    }
  ];

  const getCategoryColor = (color: string): string => {
    const colors: Record<string, string> = {
      'blue': 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/10',
      'green': 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400 hover:bg-green-500/10',
      'purple': 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/10',
      'amber': 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
    };
    return colors[color] || '';
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= 1000) {
      setContent(content);
      setCharCount(content.length);
    }
  };

  const handleSave = async () => {
    if (title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    }
    if (content.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    try {
      await _axiosAuth.put(`/article/${articleDetail.articleId}`, {
        title,
        content,
        category: selectedCategory,
      });
      alert('수정이 완료되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['article', articleDetail.articleId],
      });
      onComplete();
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          게시글 수정
        </h2>

        {/* 카테고리 선택 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-zinc-400 mb-3">
            카테고리 선택
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                          bg-gradient-to-br border
                          ${selectedCategory === category.id
                            ? getCategoryColor(category.color)
                            : 'bg-zinc-700/30 border-zinc-600/30 text-zinc-400 hover:bg-zinc-700/50'
                          }`}
              >
                {category.icon}
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-zinc-500">{category.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 제목 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            제목
          </label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg
                     text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500
                     transition-colors"
            maxLength={100}
          />
        </div>

        {/* 내용 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            내용
          </label>
          <div className="relative">
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={handleContentChange}
              className="w-full h-64 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg
                       text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500
                       transition-colors resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
              {charCount}/1000
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600
                     transition-colors"
          >
            취소
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600
                     hover:from-amber-600 hover:to-amber-700 text-white font-medium
                     transition-colors"
          >
            수정 완료
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
