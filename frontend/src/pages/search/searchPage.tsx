import React, { useState } from 'react';

// 더미 데이터 예시
interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
}

// 핫한 콘텐츠 더미 데이터
const hotSongs: Song[] = [
  { id: 1, title: 'Hot Song 1', artist: 'Artist A', thumbnail: 'src/assets/hot1.jpg' },
  { id: 2, title: 'Hot Song 2', artist: 'Artist B', thumbnail: 'src/assets/hot2.jpg' },
  { id: 3, title: 'Hot Song 3', artist: 'Artist C', thumbnail: 'src/assets/hot3.jpg' },
];

const hotPosts: Post[] = [
  {
    id: 1,
    title: 'Popular Post 1',
    excerpt: '게시글 내용 요약...',
    thumbnail: 'src/assets/post1.jpg',
  },
  {
    id: 2,
    title: 'Popular Post 2',
    excerpt: '게시글 내용 요약...',
    thumbnail: 'src/assets/post2.jpg',
  },
  {
    id: 3,
    title: 'Popular Post 3',
    excerpt: '게시글 내용 요약...',
    thumbnail: 'src/assets/post3.jpg',
  },
];

// 검색 결과 더미 데이터 (검색 시 보여질 연관 결과)
const relatedSongs: Song[] = [
  { id: 101, title: 'Related Song A', artist: 'Artist X', thumbnail: 'src/assets/related1.jpg' },
  { id: 102, title: 'Related Song B', artist: 'Artist Y', thumbnail: 'src/assets/related2.jpg' },
];

const relatedPosts: Post[] = [
  {
    id: 201,
    title: 'Related Post A',
    excerpt: '관련 게시글 내용 요약...',
    thumbnail: 'src/assets/relatedpost1.jpg',
  },
  {
    id: 202,
    title: 'Related Post B',
    excerpt: '관련 게시글 내용 요약...',
    thumbnail: 'src/assets/relatedpost2.jpg',
  },
];

// 검색 바 컴포넌트
const SearchBar: React.FC<{
  query: string;
  setQuery: (q: string) => void;
}> = ({ query, setQuery }) => {
  return (
    <div className="px-6 py-4 bg-stone-100">
      <input
        type="text"
        placeholder="검색어를 입력하세요..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-amber-500"
      />
    </div>
  );
};

// 이전/연관 검색어 컴포넌트 (검색 전/중에 노출)
const SearchSuggestions: React.FC = () => {
  // 더미 검색어 예시
  const suggestions = ['아이돌', '발라드', '힙합', '인디'];
  return (
    <div className="px-6 py-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">최근 검색어</h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((word, index) => (
          <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

// 핫한 콘텐츠 컴포넌트 (검색 전)
const HotContent: React.FC = () => {
  return (
    <div className="px-6 py-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">핫한 콘텐츠</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* 핫한 노래 섹션 */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">핫한 노래</h4>
          <div className="space-y-2">
            {hotSongs.map((song) => (
              <div key={song.id} className="flex items-center gap-3 p-2 bg-white rounded shadow">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="text-sm">{song.title}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 인기 게시글 섹션 */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">인기 게시글</h4>
          <div className="space-y-2">
            {hotPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-2 bg-white rounded shadow">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="text-sm">{post.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 검색 결과 컴포넌트
const SearchResults: React.FC = () => {
  return (
    <div className="px-6 py-4 space-y-8">
      {/* 연관 노래 결과 섹션 */}
      <div>
        <h4 className="text-lg font-bold text-gray-800 mb-4">연관 노래</h4>
        <div className="grid grid-cols-2 gap-4">
          {relatedSongs.map((song) => (
            <div
              key={song.id}
              className="bg-white p-4 rounded shadow hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="text-sm font-medium">{song.title}</div>
              <div className="text-xs text-gray-500">{song.artist}</div>
            </div>
          ))}
        </div>
      </div>
      {/* 연관 게시글 결과 섹션 */}
      <div>
        <h4 className="text-lg font-bold text-gray-800 mb-4">연관 게시글</h4>
        <div className="grid grid-cols-2 gap-4">
          {relatedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded shadow hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="text-sm font-medium">{post.title}</div>
              <div className="text-xs text-gray-500">{post.excerpt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-amber-50">
      {/* 검색바 */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* 검색어가 없으면 이전 검색어 & 핫 콘텐츠 노출 */}
      {query.trim() === '' ? (
        <>
          <SearchSuggestions />
          <HotContent />
        </>
      ) : (
        // 검색어가 있으면 검색 결과 노출 (추후 실제 검색 로직 연동)
        <SearchResults />
      )}
    </div>
  );
};

export default SearchPage;
