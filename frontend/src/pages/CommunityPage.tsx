import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/services/JYapi';
import { Post } from '@/types/index';

import { CommunityCreate } from '../components/community/CommunityCreate';
import { CommunityDetail } from '../components/community/CommunityDetail';
import { CommunityList } from '../components/community/CommunityList';

interface CommunityResponse {
  body: {
    data: Post[];
  };
}

export const CommunityPage: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  // `useQuery`의 반환 타입을 명확히 `Post[]`로 지정합니다.
  const { data: posts = [], error } = useQuery<Post[], Error>({
    queryKey: ['articles'],
    queryFn: async () => {
      try {
        const { data } = await _axiosAuth.get<CommunityResponse>('/article');
        return data?.body?.data ?? [];
      } catch (err) {
        console.error('Error fetching posts:', err);
        throw err;
      }
    },
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // 선택된 포스트가 있으면 CommunityDetail 컴포넌트를 렌더링합니다.
  if (
    selectedPost !== null &&
    Array.isArray(posts) &&
    posts.some((post) => post.articleId === selectedPost)
  ) {
    return <CommunityDetail articleId={selectedPost} setSelectedPost={setSelectedPost} />;
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

        <button
          onClick={handleToggleCreate}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {showCreate ? 'Back' : 'Create Post'}
        </button>

        {showCreate && <CommunityCreate posts={posts} />}

        {!showCreate && !selectedPost ? (
          <div>
            {/* posts는 Post[] 타입으로, 안전하게 map을 사용할 수 있습니다. */}
            {Array.isArray(posts) &&
              posts.map((post) => (
                <div onClick={() => setSelectedPost(post.articleId)}>
                  <CommunityList post={post} />
                </div>
              ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
