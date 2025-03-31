import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CommunityComment } from './CommunityComment';
import { _axiosAuth } from '../../services/JYapi';

interface CommunityDetailProps {
  articleId: number;
  setSelectedPost: (value: number | null) => void; // 상태 변경 함수 타입 정의
}

interface Comment {
  commentId: number; // 댓글 ID
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  updateAt: string;
  isDeleted: boolean;
  comments: Comment[]; // 대댓글
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
  const queryClient = useQueryClient(); // 쿼리 클라이언트 인스턴스 생성

  const {
    data: articleDetail,
    isLoading,
    error,
  } = useQuery<ArticleDetail, Error>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/article/${articleId}`);
      return data; // API 응답에서 데이터 추출
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
      queryClient.invalidateQueries(['article', articleId]); // 댓글 작성 후 해당 게시물의 댓글 목록을 새로고침
      setNewComment(''); // 입력 필드 초기화
    },
  });

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') {
      alert('댓글을 입력하세요!');
      return;
    }

    mutation.mutate(newComment); // 댓글 작성 요청
    setNewComment(''); // 댓글 입력란 초기화
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
    <div className="bg-zinc-900 py-4 text-white rounded-lg">
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
        <div className="mb-4">
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
          articleDetail.comments.map((comment) => (
            <div key={comment.commentId} className="mb-4 p-4 bg-zinc-800 rounded-lg">
              <p className="text-sm text-gray-400">
                {comment.username} | {new Date(comment.createdAt).toLocaleString()}
              </p>
              <p>{comment.content}</p>

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
