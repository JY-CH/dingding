import React, { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { _axiosAuth } from '@/services/JYapi';
import { Comment } from '@/types/index'; // 필요한 경로로 조정하세요

interface CommunityCommentProps {
  comments: Comment[]; // 댓글 배열
  parentId: number; // 부모 댓글 ID (대댓글 작성 시 필요)
  articleId: number; // 게시물 ID
}

export const CommunityComment: React.FC<CommunityCommentProps> = ({
  comments,
  parentId,
  articleId,
}) => {
  const [replyContent, setReplyContent] = useState(''); // 대댓글 입력 상태
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // 현재 대댓글을 작성 중인 댓글 ID
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await _axiosAuth.post(`/article/${articleId}/comment/${parentId}`, {
        content,
      }); // 대댓글 작성 API 호출
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['article', articleId]); // 댓글 목록 새로고침
      setReplyContent(''); // 입력 필드 초기화
      setReplyingTo(null); // 대댓글 작성 상태 초기화
    },
  });

  const handleReplySubmit = () => {
    if (replyContent.trim() === '') {
      alert('대댓글 내용을 입력해주세요.');
      return;
    }
    mutation.mutate(replyContent);
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.commentId} className="p-4 bg-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">
              {comment.username} | {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
          <p className="mb-2">{comment.content}</p>
        </div>
      ))}

      {/* 대댓글 작성 버튼 */}
      <button
        onClick={() => setReplyingTo(parentId)}
        className="text-sm text-amber-500 hover:underline"
      >
        답글 작성
      </button>

      {/* 대댓글 작성 폼 */}
      {replyingTo === parentId && (
        <div className="mt-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="대댓글을 입력하세요..."
            className="w-full p-2 bg-zinc-700 text-white rounded-lg resize-none"
            rows={2}
          />
          <button
            onClick={handleReplySubmit}
            className="mt-2 py-1 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? '작성 중...' : '대댓글 작성'}
          </button>
        </div>
      )}
    </div>
  );
};
