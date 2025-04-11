import React, { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineReply } from 'react-icons/hi';
import { motion,  } from 'framer-motion';

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
}) => {
  const [replyContent, setReplyContent] = useState(''); // 대댓글 입력 상태
  const [editContent, setEditContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore.getState().getUser()?.username || ''; // 현재 로그인한 사용자의 username (string 타입)

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

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await _axiosAuth.post(`/article/${articleId}/comment/${parentId}`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      setReplyContent('');
      setShowReplyForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await _axiosAuth.delete(`/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      await _axiosAuth.put(`/comment/${commentId}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      setEditingCommentId(null);
      setEditContent('');
    },
  });

  const handleReplySubmit = () => {
    if (replyContent.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    replyMutation.mutate(replyContent);
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteMutation.mutate(commentId);
    }
  };

  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setEditContent(comment.content);
  };

  const handleEditSubmit = (commentId: number) => {
    if (editContent.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    editMutation.mutate({ commentId, content: editContent });
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <motion.div
          key={comment.commentId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700">
                <img
                  src={comment.userProfile || '/profile-placeholder.png'}
                  alt={comment.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-zinc-200">{comment.username}</h3>
                <span className="text-xs text-zinc-400">{formatDate(comment.createdAt)}</span>
              </div>
            </div>

            {!comment.isDeleted && comment.username === currentUserId && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditStart(comment)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm
                           bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700"
                >
                  <HiOutlinePencilAlt className="w-4 h-4" />
                  <span>수정</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteComment(comment.commentId)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm
                           bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  <span>삭제</span>
                </motion.button>
              </div>
            )}
          </div>

          {comment.isDeleted ? (
            <p className="text-zinc-500 italic">삭제된 댓글입니다.</p>
          ) : editingCommentId === comment.commentId ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg
                         text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500
                         transition-colors resize-none h-24"
                placeholder="댓글을 수정하세요..."
              />
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingCommentId(null)}
                  className="px-3 py-1 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600
                           transition-colors text-sm"
                >
                  취소
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditSubmit(comment.commentId)}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600
                           transition-colors text-sm"
                >
                  저장
                </motion.button>
              </div>
            </div>
          ) : (
            <p className="text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* 대댓글 목록 */}
          {!comment.isDeleted && comment.comments.length > 0 && (
            <div className="mt-4 pl-6 border-l border-zinc-700/50">
              <CommunityComment
                comments={comment.comments}
                parentId={comment.commentId}
                articleId={articleId}
                commentIsDeleted={comment.isDeleted}
              />
            </div>
          )}

          {/* 답글 작성 폼 */}
          {!comment.isDeleted && (
            <div className="mt-4">
              {showReplyForm ? (
                <div className="space-y-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="답글을 입력하세요..."
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg
                             text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500
                             transition-colors resize-none h-24"
                  />
                  <div className="flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowReplyForm(false)}
                      className="px-3 py-1 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600
                               transition-colors text-sm"
                    >
                      취소
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReplySubmit}
                      className="px-3 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600
                               transition-colors text-sm"
                    >
                      답글 작성
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReplyForm(true)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm
                           bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700 transition-colors"
                >
                  <HiOutlineReply className="w-4 h-4" />
                  <span>답글</span>
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
