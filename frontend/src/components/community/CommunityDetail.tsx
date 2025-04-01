import { use, useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CommunityComment } from './CommunityComment';
import { _axiosAuth } from '../../services/JYapi';
import { useAuthStore } from '../../store/useAuthStore';

interface CommunityDetailProps {
  articleId: number;
  setSelectedPost: (value: number | null) => void;
}

interface Comment {
  commentId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  updateAt: string;
  isDeleted: boolean;
  comments: Comment[];
}

interface ArticleDetail {
  articleId: number;
  userId: number;
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

export const CommunityDetail: React.FC<CommunityDetailProps> = ({ articleId, setSelectedPost }) => {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore.getState().getUser()?.username || ''; // 현재 로그인한 사용자의 username (string 타입)

  const {
    data: articleDetail,
    isLoading,
    error,
  } = useQuery<ArticleDetail, Error>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/article/${articleId}`);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newComment: string) => {
      const response = await _axiosAuth.post(`/article/${articleId}/comment`, {
        content: newComment,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['article', articleId]);
      setNewComment('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await _axiosAuth.delete(`/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['article', articleId]);
    },
  });

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') {
      alert('댓글을 입력하세요!');
      return;
    }

    mutation.mutate(newComment);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteMutation.mutate(commentId);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!articleDetail) {
    return <div>No article found.</div>;
  }

  return (
    <div className="bg-zinc-900 py-4 text-white rounded-lg pb-[100px]">
      <button
        onClick={() => setSelectedPost(null)}
        className="mb-4 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
      >
        Back
      </button>

      <div className="flex flex-col">
        <h1 className="text-2xl font-[1000] mb-2">{articleDetail.title}</h1>
        <div className="text-sm text-gray-400 flex flex-row gap-3">
          <div>작성일: {new Date(articleDetail.createdAt).toLocaleString()}</div>
          <div>작성자: {articleDetail.userId}</div>
        </div>
      </div>
      <p className="mb-4 mt-[100px]">{articleDetail.content}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">댓글</h2>
        <hr className="border-gray-700" />
        <div className="mb-4 mt-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full p-2 bg-zinc-800 text-white rounded-lg resize-none"
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
        {articleDetail.comments.length > 0 ? (
          articleDetail.comments
            .slice()
            .reverse()
            .map((comment) => (
              <div key={comment.commentId} className="mb-4 p-4 bg-zinc-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 mb-1">
                    {comment.username} | {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  {!comment.isDeleted && comment.username === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-2">
                  {comment.isDeleted ? (
                    <span className="text-gray-500 italic">삭제된 댓글입니다</span>
                  ) : (
                    comment.content
                  )}
                </p>

                {/* 대댓글 렌더링 */}
                <div className="mt-4 pl-4 border-l border-gray-600">
                  <CommunityComment
                    comments={comment.comments}
                    parentId={comment.commentId}
                    articleId={articleId}
                  />
                </div>
              </div>
            ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
