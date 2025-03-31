import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/services/JYapi';
import { CommunityPost } from '@/types/index'; // 필요한 경로로 조정하세요

import { CommunityCreate } from '../components/community/CommunityCreate';
import { CommunityDetail } from '../components/community/CommunityDetail';
import { CommunityList } from '../components/community/CommunityList';

// API 응답이 배열 형태라면 이렇게 정의해야 합니다
type CommunityResponse = CommunityPost[];

export const CommunityPage: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

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
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleToggleCreate = () => {
    setShowCreate(!showCreate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Community</h1>
            <h5 className="text-zinc-400"> Welcome To The Community</h5>
          </div>
        </header>

        {selectedPost !== null ? (
          <CommunityDetail articleId={selectedPost} setSelectedPost={setSelectedPost} />
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
                {posts.length > 0 ? (
                  posts
                    .slice()
                    .reverse()
                    .map((post) => (
                      <div
                        key={post.articleId}
                        onClick={() => setSelectedPost(post.articleId)}
                        className="p-4 rounded-xl cursor-pointer transition-all duration-300 
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
