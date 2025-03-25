import React from 'react';

import RelatedPosts from './RelatedPosts';
import RelatedSongs from './RelatedSongs';

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

interface SearchResultsProps {
  activeTab: string;
}

// 더미 데이터 예시 (실제 API 또는 상위 컴포넌트에서 받아오도록 변경 가능)
const relatedSongs: Song[] = [
  { id: 101, title: 'Related Song A', artist: 'Artist X', thumbnail: 'src/assets/노래.jpg' },
  { id: 102, title: 'Related Song B', artist: 'Artist Y', thumbnail: 'src/assets/노래.jpg' },
];

const relatedPosts: Post[] = [
  {
    id: 201,
    title: 'Related Post A',
    excerpt: '관련 게시글 내용 요약...',
    thumbnail: 'src/assets/노래.jpg',
  },
  {
    id: 202,
    title: 'Related Post B',
    excerpt: '관련 게시글 내용 요약...',
    thumbnail: 'src/assets/노래.jpg',
  },
];

const SearchResults: React.FC<SearchResultsProps> = ({ activeTab }) => {
  // activeTab에 따라 표시할 콘텐츠를 전환합니다.
  if (activeTab === 'all') {
    return (
      <div className="px-6 py-4 bg-zinc-900 min-h-screen space-y-8">
        <RelatedSongs songs={relatedSongs} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    );
  } else if (activeTab === 'albums') {
    return (
      <div className="px-6 py-4 bg-zinc-900 min-h-screen">
        <RelatedSongs songs={relatedSongs} />
      </div>
    );
  } else if (activeTab === 'community') {
    return (
      <div className="px-6 py-4 bg-zinc-900 min-h-screen">
        <RelatedPosts posts={relatedPosts} />
      </div>
    );
  } else if (activeTab === 'artists') {
    return (
      <div className="px-6 py-4 bg-zinc-900 min-h-screen">
        <p className="text-white text-center">관련 데이터가 없습니다.</p>
      </div>
    );
  }

  return null;
};

export default SearchResults;
