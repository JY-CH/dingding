import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '../../services/JYapi';

interface CommunityDetailProps {
  articleId: number;
  setSelectedPost: (value: number | null) => void; // 상태 변경 함수 타입 정의
}
interface Comment {
  commentId: number;
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
  console.log(articleId);
  const {
    data: articleDetail,
    isLoading,
    error,
  } = useQuery<ArticleDetail, Error>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/article/${articleId}`);
      console.log(data);
      return data; // API 응답에서 데이터 추출
    },
  });

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
    <div className="p-4 bg-zinc-900 text-white rounded-lg">
      <button
        onClick={() => setSelectedPost(null)}
        className="mb-4 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{articleDetail.title}</h1>
      <p className="text-sm text-gray-400 mb-4">
        작성자: {articleDetail.userId} | 작성일:{' '}
        {new Date(articleDetail.createdAt).toLocaleString()}
      </p>
      <p className="mb-4">{articleDetail.content}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">댓글</h2>
        {articleDetail.comments.length > 0 ? (
          articleDetail.comments.map((comment) => (
            <div key={comment.commentId} className="mb-4 p-4 bg-zinc-800 rounded-lg">
              <p className="text-sm text-gray-400">
                {comment.username} | {new Date(comment.createdAt).toLocaleString()}
              </p>
              <p>{comment.content}</p>

              {/* 대댓글 렌더링 */}
              {comment.comments.length > 0 && (
                <div className="mt-4 pl-4 border-l border-gray-600">
                  {comment.comments.map((reply) => (
                    <div key={reply.commentId} className="mb-2">
                      <p className="text-sm text-gray-400">
                        {reply.username} | {new Date(reply.createdAt).toLocaleString()}
                      </p>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
