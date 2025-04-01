import React, { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { _axiosAuth } from '@/services/JYapi';
import { Comment } from '@/types/index'; // 필요한 경로로 조정하세요

import { useAuthStore } from '../../store/useAuthStore';

interface CommunityCommentProps {
  comments: Comment[]; // 댓글 배열
  parentId: number; // 부모 댓글 ID (대댓글 작성 시 필요)
  articleId: number; // 게시물 ID
  commentIsDeleted: boolean; // 댓글 삭제 여부
}
export const CommunityComment: React.FC<CommunityCommentProps> = ({
  comments,
  parentId,
  articleId,
  commentIsDeleted,
}) => {
  const [replyContent, setReplyContent] = useState(''); // 대댓글 입력 상태
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore.getState().getUser()?.username || ''; // 현재 로그인한 사용자의 username (string 타입)
  const [commentModal, setCommentModal] = useState(false); // 댓글 모달 상태
  console.log('현재 로그인된 사용자:', currentUserId);

  const replyMutation = useMutation<void, Error, string>({
    mutationFn: async (content: string) => {
      const response = await _axiosAuth.post(`/article/${articleId}/comment/${parentId}`, {
        content,
      }); // 대댓글 작성 API 호출
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
      setReplyContent(''); // 입력 필드 초기화
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (commentId: number) => {
      console.log('삭제 요청 commentId:', commentId); // 요청 ID 확인
      const response = await _axiosAuth.delete(`/comment/${commentId}`);
      console.log('삭제 요청 응답:', response); // 응답 확인
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
    },
  });

  const handleReplySubmit = () => {
    if (replyContent.trim() === '') {
      alert('대댓글 내용을 입력해주세요.');
      return;
    }
    replyMutation.mutate(replyContent);
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('정말로 이 대댓글을 삭제하시겠습니까?')) {
      deleteMutation.mutate(commentId);
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.commentId} className="p-4 bg-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              {/* 유저 프로필 이미지 */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={comment.userProfile}
                  alt="댓글 작성자 프로필"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 유저 이름과 작성 시간 */}
              <p className="text-sm text-gray-400 flex flex-col gap-1">
                <span className="font-bold text-gray-1000 text-md">{comment.username}</span>
                <span className="text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
              </p>
            </div>
            {/* 삭제 버튼 */}
            {!comment.isDeleted && comment.username === currentUserId && (
              <button
                onClick={() => handleDeleteComment(comment.commentId)}
                className="text-sm text-red-500 hover:underline"
              >
                x
              </button>
            )}
          </div>
          {/* 댓글 내용 */}
          <p className="mb-2">
            {comment.isDeleted ? (
              <span className="text-gray-500 italic">삭제된 댓글입니다.</span>
            ) : (
              comment.content
            )}
          </p>

          {/* 대댓글 렌더링 */}
          {!comment.isDeleted && comment.comments.length > 0 && (
            <div className="mt-4 pl-4 border-l border-gray-600">
              <CommunityComment
                comments={comment.comments}
                parentId={comment.commentId}
                articleId={articleId}
                commentIsDeleted={comment.isDeleted}
              />
            </div>
          )}
        </div>
      ))}

      {/* 항상 최하단에 위치하는 대댓글 입력창 */}
      {!commentIsDeleted ? (
        commentModal ? (
          <div className="mt-4">
            <div className="flex flex-row items-center justify-between gap-1 mt-2 h-[50px]">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full pt-4 pl-4 flex h-[50px] text-[10px] border-2 border-gray-700 bg-zinc-800 text-white rounded-lg resize-none"
                rows={2}
              />
              <div className="flex ">
                <button
                  onClick={handleReplySubmit}
                  className="bg-amber-500 w-[70px]  hover:bg-amber-600 text-white rounded-lg px-2 py-1 min-h-[50px]"
                >
                  <div className="text-[10px]">'댓글 작성'</div>
                </button>
              </div>
            </div>
            <div className="flex justify-end items-center mt-2">
              <button
                className="hover:bg-gray-700 rounded-lg text-gray-400 mt-1"
                onClick={() => setCommentModal(false)}
              >
                <span className="p-3">닫기</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              className="text-gray-400 hover:bg-gray-700 rounded-lg"
              onClick={() => setCommentModal(true)}
            >
              <span className="p-3">답글</span>
            </button>
          </div>
        )
      ) : null}
    </div>
  );
};
