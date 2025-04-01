import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import lickeIcon from '@/assets/like.svg'; // 필요한 경로로 조정하세요
import unLikeIcon from '@/assets/unlike.svg'; // 필요한 경로로 조정하세요

import { CommunityComment } from './CommunityComment';
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
  posts,
}) => {
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
      const { data } = await _axiosAuth.get<ArticleDetail>(`/article/${articleId}`);
      return data;
    },
  });

  // 게시글 목록 페이지 이동용
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const postsPerPage = 4; // 페이지당 게시글 수

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  // 날짜변경용용
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2); // 연도 마지막 두 자리
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월
    const day = date.getDate().toString().padStart(2, '0'); // 일
    const hours = date.getHours().toString().padStart(2, '0'); // 시간
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 분

    return `${year}.${month}.${day}. ${hours}:${minutes}`;
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await _axiosAuth.post(`/article/${articleId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
    },
  });

  const unLickeMutation = useMutation({
    mutationFn: async () => {
      await _axiosAuth.delete(`/article/${articleId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
      setNewComment('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await _axiosAuth.delete(`/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
    },
  });

  const handleLikeClick = () => {
    likeMutation.mutate();
  };
  const handleUnlikeClick = () => {
    unLickeMutation.mutate();
  };

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
    <div className="flex">
      <div className="bg-zinc-900 py-4 w-2/3 text-white rounded-lg pb-[100px] pr-[80px]">
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-4 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
        >
          Back
        </button>

        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-[1000] mb-2">{articleDetail.title}</h1>
            <button
              onClick={() => (articleDetail.isLike ? handleUnlikeClick() : handleLikeClick())}
              className="flex items-center gap-2"
            >
              <img
                src={articleDetail.isLike ? unLikeIcon : lickeIcon}
                alt={articleDetail.isLike ? '좋아요 취소' : '좋아요'}
                className="w-6 h-6"
              />
              <span>{articleDetail.recommend}</span>
            </button>
          </div>
          <div className="text-sm text-gray-400 items-center flex flex-row gap-3 justify-between">
            <div>{new Date(articleDetail.createdAt).toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <img
                src={
                  articleDetail.userProfile ||
                  'https://ddingga.s3.ap-northeast-2.amazonaws.com/basic_profile.png'
                }
                alt="작성자 프로필"
                className="w-8 h-8 rounded-full"
              />
              <span>{articleDetail.username}</span>
            </div>
          </div>
        </div>
        <p className="mb-10 mt-[70px]">{articleDetail.content}</p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">댓글</h2>
          <hr className="border-gray-700" />
          <div className="mb-4 mt-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full pt-5 pl-4 flex h-[50px] text-[10px] bg-zinc-800 text-white rounded-lg resize-none"
              rows={3}
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              '댓글 작성'
            </button>
          </div>
          {articleDetail.comments.length > 0 ? (
            articleDetail.comments
              .slice()
              .reverse()
              .map((comment) => (
                <div key={comment.commentId} className="mb-4 p-7 bg-zinc-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="h-auto">
                      <div className="text-sm h-full text-gray-400 mb-1 flex flex-row gap-2 items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center">
                          <img
                            src={comment.userProfile}
                            alt="댓글 작성자 프로필"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-1000 text-lg">
                            {comment.username}
                          </span>
                          <span className="text-xs">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!comment.isDeleted && comment.username === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="text-sm text-red-500 hover:underline mr-4"
                      >
                        x
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
                      commentIsDeleted={comment.isDeleted}
                    />
                  </div>
                </div>
              ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="m-10 w-[27%] h-[80%] p-10 border-solid border-zinc-700 rounded-3xl border-2 fixed right-10 top-0 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-10 text-amber-500">게시글 목록</h2>
        <div className=" rounded-lg">
          {currentPosts.length > 0 ? (
            currentPosts
              .slice()
              .reverse()
              .map((post) => (
                <div className="mb-4" key={post.articleId}>
                  <button
                    onClick={() => setSelectedPost(post.articleId)}
                    className="mb-4 rounded-lg cursor-pointer transition-colors text-left w-full bg-transparent"
                  >
                    <div className="text-xl font-semibold mb-2">{post.title}</div>
                    <div className="flex flex-row items-center justify-between text-xs text-gray-400">
                      <div>{formatDate(post.createdAt)}</div>
                      <div className="flex items-center gap-1">
                        <img src={lickeIcon} alt="Like Icon" className="w-4 h-4" />
                        <span>{post.recommend}</span>
                      </div>
                    </div>
                  </button>
                  <hr />
                </div>
              ))
          ) : (
            <div className="text-center text-gray-400">게시물이 없습니다.</div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 mx-1 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
