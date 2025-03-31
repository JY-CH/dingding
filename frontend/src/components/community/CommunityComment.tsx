import React from 'react';

import { Comment } from '@/types/index'; // 필요한 경로로 조정하세요

interface CommunityCommentProps {
  comments: Comment[]; // 댓글 배열
}

export const CommunityComment: React.FC<CommunityCommentProps> = ({ comments }) => {
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

          {/* 대댓글 렌더링 */}
          {comment.comments.length > 0 && (
            <div className="mt-4 pl-4 border-l border-gray-600">
              <CommunityComment comments={comment.comments} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
