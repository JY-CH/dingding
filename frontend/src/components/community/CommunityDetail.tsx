import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlineHeart, HiOutlineChat, HiOutlineArrowLeft, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

// import lickeIcon from '@/assets/like.svg'; // 필요한 경로로 조정하세요
// import unLikeIcon from '@/assets/unlike.svg'; // 필요한 경로로 조정하세요

import { CommunityComment } from './CommunityComment';
import { CommunityEdit } from './CommunityEdit';
import { _axiosAuth } from '../../services/JYapi';
import { useAuthStore } from '../../store/useAuthStore';
import { Post } from '../../types/index'; // 필요한 경로로 조정하세요

interface CommunityDetailProps {
  articleId: number;
  setSelectedPost: (value: number | null) => void;
  posts: Post[];
}

interface Comment {
  commentId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  updateAt: string;
  isDeleted: boolean;
  userProfile: string; // 댓글 작성자 프로필 이미지 URL
  comments: Comment[];
}

interface ArticleDetail {
  articleId: number;
  userId: number;
  userProfile: string; // 작성자 프로필 이미지 URL
  username: string; // 작성자 이름
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  popularPost: boolean;
  recommend: number;
  isLike: boolean;
  comments: Comment[];
}

export const CommunityDetail: React.FC<CommunityDetailProps> = ({
  articleId,
  setSelectedPost,
  // posts,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore.getState().getUser()?.username || '';

  const {
    data: articleDetail,
    isLoading,
    error,
  } = useQuery<ArticleDetail, Error>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data } = await _axiosAuth.get<ArticleDetail>(`/article/${articleId}`);
      return data;
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async () => {
      const response = await _axiosAuth.delete(`/article/${articleId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      setSelectedPost(null);
      window.location.reload();
    },
    onError: (error) => {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await _axiosAuth.post(`/article/${articleId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      await _axiosAuth.delete(`/article/${articleId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await _axiosAuth.post(`/article/${articleId}/comment`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      setNewComment('');
    },
  });

  const handleDeleteArticle = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteArticle.mutate();
    }
  };

  const handleLikeToggle = () => {
    if (articleDetail?.isLike) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') {
      alert('댓글을 입력하세요!');
      return;
    }
    commentMutation.mutate(newComment);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>오류가 발생했습니다: {error.message}</p>
      </div>
    );
  }

  if (!articleDetail) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <CommunityEdit
        articleDetail={articleDetail}
        onCancel={() => setIsEditing(false)}
        onComplete={() => setIsEditing(false)}
      />
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}분 전`;
      }
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedPost(null);
            queryClient.invalidateQueries({ queryKey: ['articles'] });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300
                     hover:bg-zinc-700 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span>돌아가기</span>
        </motion.button>

        {articleDetail.username === currentUserId && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400
                       hover:bg-amber-500/30 transition-colors"
            >
              <HiOutlinePencilAlt className="w-5 h-5" />
              <span>수정</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteArticle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400
                       hover:bg-red-500/30 transition-colors"
            >
              <HiOutlineTrash className="w-5 h-5" />
              <span>삭제</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* 게시글 내용 */}
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700">
              <img
                src={articleDetail.userProfile || '/profile-placeholder.png'}
                alt={articleDetail.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg text-white">{articleDetail.username}</h3>
              <p className="text-sm text-zinc-400">{formatDate(articleDetail.createdAt)}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                     ${articleDetail.isLike
                       ? 'bg-amber-500/20 text-amber-400'
                       : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                     }`}
          >
            <HiOutlineHeart className={`w-5 h-5 ${articleDetail.isLike ? 'fill-amber-400' : ''}`} />
            <span>{articleDetail.recommend}</span>
          </motion.button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{articleDetail.title}</h1>
        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap mb-6">
          {articleDetail.content}
        </p>

        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <HiOutlineChat className="w-4 h-4" />
            <span>{articleDetail.comments.length}개의 댓글</span>
          </div>
          <span>•</span>
          <span>{formatDate(articleDetail.updatedAt)}</span>
        </div>
      </div>

      {/* 댓글 작성 */}
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold mb-6">댓글 작성</h2>
        <div className="flex gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg
                     text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500
                     transition-colors resize-none h-24"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCommentSubmit}
            className="px-6 py-3 h-fit rounded-lg bg-gradient-to-r from-amber-500 to-amber-600
                     hover:from-amber-600 hover:to-amber-700 text-white font-medium
                     transition-colors whitespace-nowrap"
          >
            댓글 작성
          </motion.button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        <AnimatePresence>
          {articleDetail.comments.length > 0 ? (
            articleDetail.comments
              .slice()
              .reverse()
              .map((comment) => (
                <motion.div
                  key={comment.commentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CommunityComment
                    comments={[comment]}
                    parentId={comment.commentId}
                    articleId={articleId}
                    commentIsDeleted={comment.isDeleted}
                  />
                </motion.div>
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-400"
            >
              <p>첫 번째 댓글을 작성해보세요!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
