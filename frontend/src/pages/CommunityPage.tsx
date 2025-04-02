import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/services/JYapi';
import { Post } from '@/types/index'; // 필요한 경로로 조정하세요

import { CommunityCreate } from '../components/community/CommunityCreate';
import { CommunityDetail } from '../components/community/CommunityDetail';
import { CommunityList } from '../components/community/CommunityList';

// API 응답이 배열 형태라면 이렇게 정의해야 합니다
type CommunityResponse = Post[];

export const CommunityPage: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const postsPerPage = 4; // 페이지당 표시할 게시물 수

  const { data: posts = [], error } = useQuery<CommunityResponse, Error>({
    queryKey: ['articles'],
    queryFn: async () => {
      try {
        const { data } = await _axiosAuth.get<CommunityResponse>('/article');
        console.log('API 응답:', data); // 구조 확인
        return data;
      } catch (err) {
        console.error('게시물 가져오기 오류:', err);
        throw err;
      }
    },
    staleTime: 0,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleToggleCreate = () => {
    setShowCreate(!showCreate);
  };

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice().reverse().slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-zinc-900 text-white p-8 pb-[10%]">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Community</h1>
            <h5 className="text-zinc-400"> Welcome To The Community</h5>
          </div>
        </header>

        {selectedPost !== null ? (
          <CommunityDetail
            articleId={selectedPost}
            setSelectedPost={setSelectedPost}
            posts={posts.slice().reverse()}
          />
        ) : (
          <>
            <button
              onClick={handleToggleCreate}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {showCreate ? 'Back' : 'Create Post'}
            </button>

            {showCreate && <CommunityCreate />}

            {!showCreate && (
              <div className="space-y-10">
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <div
                      key={post.articleId}
                      onClick={() => setSelectedPost(post.articleId)}
                      className="rounded-xl cursor-pointer transition-all duration-300 
                                 bg-zinc-900 hover:scale-[1.02] 
                                 transform ease-in-out"
                    >
                      <CommunityList post={post} />
                    </div>
                  ))
                ) : (
                  <div>
                    <p>게시물이 없습니다</p>
                    <p>게시물 개수: {posts.length}</p>
                  </div>
                )}

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
            )}
          </>
        )}
      </div>
    </div>
  );
};
