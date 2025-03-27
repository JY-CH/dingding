import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

// You'll need to define these interfaces based on your actual data structure
interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string; // Or Date if you're using Date objects
  // Add other properties as needed
}

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string; // Or Date if you're using Date objects
  comments: Comment[];
  boardCreatedMemberId: string;
  picked?: boolean;
  // Add other properties as needed
}

// Placeholder for QuestionContentCard - you'll need to create this component
const QuestionContentCard: React.FC<{
  comment: Comment;
  boardId: string;
  picked?: boolean;
}> = ({ comment, boardId, picked }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-lg">
      <p className="font-bold">{comment.author}</p>
      <p className="text-gray-600">{comment.content}</p>
      <p className="text-gray-400 text-sm">
        {new Date(comment.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
      </p>
      {/* Add more details here */}
    </div>
  );
};

export const CommunityDetail: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>(); // Get the postId from the URL
  const [board, setBoard] = useState<Post | null>(null);
  const [answer, setAnswer] = useState('');
  const [boardComments, setBoardComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Initial number of comments to show
  const [boardCreatedMemberId, setBoardCreatedMemberId] = useState('');
  const [lectureInstructorInfoId, setLectureInstructorInfoId] = useState('');
  const [id, setId] = useState('');

  // Mock data for demonstration
  const mockBoard: Post = {
    id: 1,
    author: 'User1',
    title: 'My Question',
    content: 'This is the content of my question.',
    createdAt: '2023-11-20T10:00:00',
    comments: [
      { id: 1, author: 'User2', content: 'Answer 1', createdAt: '2023-11-20T11:00:00' },
      { id: 2, author: 'User3', content: 'Answer 2', createdAt: '2023-11-20T12:00:00' },
      { id: 3, author: 'User4', content: 'Answer 3', createdAt: '2023-11-20T13:00:00' },
      { id: 4, author: 'User5', content: 'Answer 4', createdAt: '2023-11-20T14:00:00' },
      { id: 5, author: 'User6', content: 'Answer 5', createdAt: '2023-11-20T15:00:00' },
      { id: 6, author: 'User7', content: 'Answer 6', createdAt: '2023-11-20T16:00:00' },
    ],
    boardCreatedMemberId: 'User1',
    picked: false,
  };

  useEffect(() => {
    // Fetch the board data based on postId
    // Replace this with your actual API call
    if (postId) {
      // Example using mock data
      setBoard(mockBoard);
      setBoardComments(mockBoard.comments);
      setBoardCreatedMemberId(mockBoard.boardCreatedMemberId);
      // setLectureInstructorInfoId(mockBoard.lectureInstructorInfoId); // Assuming you have this in your data
      // setId(mockBoard.id); // Assuming you have this in your data
    }
  }, [postId]);

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
        const newComment: Comment = {
          id: boardComments.length + 1,
          author: 'CurrentUser', // Replace with actual user
          content: answer,
          createdAt: new Date().toISOString(),
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
    <>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">{board.title || ''}</h1>
        <div className="text-[14px] text-[#868296]">
          {board?.createdAt
            ? new Date(board.createdAt).toISOString().replace('T', ' ').slice(0, 16)
            : '날짜 없음'}
        </div>
        <div className="ml-[10px] mt-[20px]">
          <p className="whitespace-pre-line text-[18px]">{board.content || ''}</p>
        </div>
      </div>
      <div className="flex w-full justify-end">
        작성자 :&nbsp;<span className="font-bold"> {boardCreatedMemberId}</span>
      </div>
      <hr />
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
                  if (!id) {
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
                  <QuestionContentCard
                    key={index}
                    comment={comment}
                    boardId={board?.boardCreatedMemberId}
                    picked={board?.picked}
                  />
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

        {lectureInstructorInfoId === id ? (
          <button
            className="ml-[10px] rounded-2xl border border-zinc-400 bg-zinc-800 p-[10px] px-[15px]"
            onClick={() => deleteBoardCheckMutation()}
          >
            <p className="text-[18px] font-semibold text-white">질문 삭제</p>
          </button>
        ) : null}
      </div>
    </>
  );
};
