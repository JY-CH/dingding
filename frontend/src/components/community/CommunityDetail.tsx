import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Post, Comment, NestedComment } from '@/types/index';

const QuestionContentCard: React.FC<{ comment: NestedComment }> = ({ comment }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-lg">
      <p className="font-bold">{comment.username}</p>
      <p className="text-gray-600">{comment.content}</p>
      <p className="text-gray-400 text-sm">
        {comment.createdAt.toISOString().replace('T', ' ').slice(0, 16)}
      </p>
      {/* Add more details here */}
    </div>
  );
};

interface CommunityDetailProps {
  board: Post | null;
  handleCloseDetails: () => void;
}

export const CommunityDetail: React.FC<CommunityDetailProps> = ({ board, handleCloseDetails }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get the id from the URL
  const [answer, setAnswer] = useState('');
  const [boardComments, setBoardComments] = useState<NestedComment[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Initial number of comments to show
  const [boardCreatedUserId, setBoardCreatedUserId] = useState<number>(0);
  const [lectureInstructorInfoId, setLectureInstructorInfoId] = useState(0); // 게시글 작성한 유저의 id값임임
  const [userId, setUserId] = useState(0); // 나중에 로그인한 유저로 넣을것임
  const [handleCloseDetails, setHandleCloseDetails] = useState(handleCloseDetails);

  // Mock data for demonstration
  const mockBoard: Post = {
    articleId: 1,
    userId: 1,
    username: 'User1',
    title: 'My Question',
    content: 'This is the content of my question.',
    createdAt: new Date(),
    category: 'Music',
    popularPost: false,
    recommend: 0,
    comments: [
      {
        commentId: 1,
        id: 2,
        username: 'User2',
        content: 'Answer 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    ],
  };

  useEffect(() => {
    // Fetch the board data based on postId
    // Replace this with your actual API call
    if (id) {
      // Example using mock data
      setBoard(mockBoard);
      setBoardComments(mockBoard?.comments);
      setBoardCreatedUserId(mockBoard.userId);
      // setLectureInstructorInfoId(mockBoard.lectureInstructorInfoId); // Assuming you have this in your data
      // setUserId(mockBoard.id); // Assuming you have this in your data
    }
  }, [id]);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const changeActive = () => {
    navigate('/community');
  };

  // Placeholder for addCommentMutation - you'll need to implement this
  const addCommentMutation = {
    mutate: () => {
      // Simulate adding a comment
      if (answer.trim() !== '') {
        const newComment: NestedComment = {
          commentId: boardComments.length + 1,
          id: userId, // Replace with actual user
          username: 'CurrentUser', // Replace with actual user
          content: answer,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
          commentId2: 0, // Replace with actual comment_id2
        };
        setBoardComments([...boardComments, newComment]);
        setAnswer('');
      }
    },
  };

  // Placeholder for deleteBoardCheckMutation - you'll need to implement this
  const deleteBoardCheckMutation = () => {
    // Simulate deleting a board
    console.log('Deleting board...');
    // Add your logic here
  };

  if (!board) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 게시글 내용 */}
        <div className="space-y-4">
          <h1 className="text-[32px] font-bold">{board.title || ''}</h1>
          <div className="text-[14px] text-[#868296]">
            {board?.createdAt
              ? board.createdAt.toISOString().replace('T', ' ').slice(0, 16)
              : '날짜 없음'}
          </div>
          <div className="ml-[10px] mt-[20px]">
            <p className="whitespace-pre-line text-[18px]">{board.content || ''}</p>
          </div>
          <div className="flex w-full justify-end">
            작성자 :&nbsp;<span className="font-bold"> {board.username}</span>
          </div>
        </div>
        <hr />

        {/* 답변 부분 */}
        <div className="mt-[20px]">
          <div className="flex items-center gap-3">
            <h1 className="text-[32px] font-bold">답변</h1>
            {board?.comments?.length > 0 ? (
              <div className="rounded-full bg-amber-500 px-[10px] py-[5px]">
                <p className="text-[14px] font-semibold text-white">답변</p>
              </div>
            ) : (
              <div className="rounded-full bg-zinc-600 px-[10px] py-[5px]">
                <p className="text-[14px] font-semibold text-zinc-400">미답변</p>
              </div>
            )}
          </div>

          <>
            <div className="mt-[20px] flex flex-col gap-2">
              <div className="mt-[20px] w-full">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault(); // 기본 엔터 동작 방지
                      addCommentMutation.mutate(); // 버튼 클릭 함수 실행
                    }
                  }}
                  className="min-h-[60px] w-full rounded-2xl border border-zinc-400 p-[20px] focus:border-amber-500 focus:outline-none bg-zinc-800/90 text-white"
                  placeholder="답변을 입력해주세요. (Shift+Enter: 줄바꿈, Enter: 작성)"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="w-[65px] rounded-2xl border border-zinc-400 bg-amber-500 p-[10px]"
                  onClick={() => {
                    if (!userId) {
                      navigate('/login');
                      // toast.error('로그인 후 이용해주세요.'); // You'll need to install and configure react-toastify
                      alert('로그인 후 이용해주세요.');
                      return;
                    }
                    addCommentMutation.mutate();
                  }}
                >
                  <p className="text-[12px] font-semibold text-white">작성하기</p>
                </button>
              </div>
            </div>
            <hr className="mt-[40px] border-zinc-400" />
          </>

          <div className="mt-[10px] min-h-[100px]">
            {boardComments?.length > 0 ? (
              <div className="space-y-3">
                {boardComments.slice(0, visibleCount).map((comment, index) => (
                  <div key={index} className="flex h-full flex-col">
                    <QuestionContentCard key={index} comment={comment} />
                  </div>
                ))}
                {/* 🔥 '더보기' 버튼 추가 (모든 댓글이 표시되면 숨김) */}
                {visibleCount < boardComments.length && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleShowMore}
                      className="mt-4 w-[70px] rounded-lg bg-amber-500 py-2 font-semibold text-white"
                    >
                      더보기
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[18px] font-medium text-zinc-400">현재 답변이 없습니다.</p>
            )}
          </div>
        </div>
        <hr className="mt-[24px] border-zinc-400" />

        <div className="mt-[20px] flex justify-end gap-2">
          <button
            className="rounded-2xl border border-zinc-400 bg-zinc-600 p-[10px]"
            onClick={() => changeActive()}
          >
            <p className="text-[18px] font-semibold text-white">뒤로가기</p>
          </button>

          {lectureInstructorInfoId === userId ? (
            <button
              className="ml-[10px] rounded-2xl border border-zinc-400 bg-zinc-800 p-[10px] px-[15px]"
              onClick={() => deleteBoardCheckMutation()}
            >
              <p className="text-[18px] font-semibold text-white">질문 삭제</p>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
