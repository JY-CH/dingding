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

// 더미 데이터 예시
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

const SearchResults: React.FC = () => {
  return (
    <div className="px-6 py-4 space-y-8">
      <RelatedSongs songs={relatedSongs} />
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
};

export default SearchResults;
