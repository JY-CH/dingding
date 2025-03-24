import React, { useState } from 'react';

import { MessageSquare, Headphones, TrendingUp, Calendar, Clock, UserCircle } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  plays?: string;
  duration?: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  author?: string;
  date?: string;
  likes?: number;
}

const SearchResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState('songs');

  const trendingSongs: Song[] = [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      thumbnail: 'src/assets/노래.jpg',
      plays: '254만',
      duration: '3:22',
    },
    {
      id: 2,
      title: 'Hype Boy',
      artist: 'NewJeans',
      thumbnail: 'src/assets/노래.jpg',
      plays: '198만',
      duration: '2:59',
    },
    {
      id: 3,
      title: 'Seven (feat. Latto)',
      artist: 'Jung Kook',
      thumbnail: 'src/assets/노래.jpg',
      plays: '325만',
      duration: '3:04',
    },
    {
      id: 4,
      title: 'Cupid',
      artist: 'FIFTY FIFTY',
      thumbnail: 'src/assets/노래.jpg',
      plays: '165만',
      duration: '2:54',
    },
    {
      id: 5,
      title: 'Smoke',
      artist: 'Dynamic Duo',
      thumbnail: 'src/assets/노래.jpg',
      plays: '78만',
      duration: '3:47',
    },
  ];

  const recentReleases: Song[] = [
    {
      id: 1,
      title: '새로운 시작',
      artist: '인기 아티스트',
      thumbnail: 'src/assets/노래.jpg',
      plays: '89만',
      duration: '3:15',
    },
    {
      id: 2,
      title: '봄날의 꿈',
      artist: '라이징 스타',
      thumbnail: 'src/assets/노래.jpg',
      plays: '42만',
      duration: '4:01',
    },
    {
      id: 3,
      title: '별이 빛나는 밤',
      artist: '인디 밴드',
      thumbnail: 'src/assets/노래.jpg',
      plays: '21만',
      duration: '3:33',
    },
  ];

  const popularPosts: Post[] = [
    {
      id: 1,
      title: '요즘 뜨는 노래 추천',
      excerpt:
        '최근에 힘든 일이 있어서 위로가 되는 노래를 찾고 있어요. 여러분의 추천 부탁드립니다.',
      thumbnail: 'src/assets/노래.jpg',
      author: '음악덕후',
      date: '오늘',
      likes: 324,
    },
    {
      id: 2,
      title: '이 가수 알고 계신가요?',
      excerpt: '요즘 인디신에서 떠오르는 신예 가수를 소개합니다. 정말 목소리가 매력적이에요!',
      thumbnail: 'src/assets/노래.jpg',
      author: '인디마니아',
      date: '어제',
      likes: 156,
    },
    {
      id: 3,
      title: '음악 추천 부탁드립니다',
      excerpt:
        '편안한 분위기의 재즈 음악을 찾고 있어요. 공부할 때 집중하기 좋은 음악 추천해주세요.',
      thumbnail: 'src/assets/노래.jpg',
      author: '재즈러버',
      date: '3일 전',
      likes: 98,
    },
  ];

  const genreCards = [
    { id: 1, name: 'Pop(팝)', songs: '120+', color: 'from-purple-500 to-indigo-500' },
    { id: 2, name: 'Folk(포크)', songs: '120+', color: 'from-pink-500 to-purple-600' },
    { id: 3, name: 'Country(컨트리)', songs: '120+', color: 'from-green-500 to-teal-500' },
    { id: 4, name: 'Acoustic(어쿠스틱)', songs: '120+', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="bg-zinc-900 min-h-screen pb-20">
      {/* 상단 탭 메뉴 */}
      <div className="px-6 py-3 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
        <div className="flex space-x-6 overflow-x-auto no-scrollbar">
          <button
            className={`text-sm whitespace-nowrap pb-2 transition-colors ${activeTab === 'songs' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-400'}`}
            onClick={() => setActiveTab('songs')}
          >
            노래
          </button>
          <button
            className={`text-sm whitespace-nowrap pb-2 transition-colors ${activeTab === 'artists' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-400'}`}
            onClick={() => setActiveTab('artists')}
          >
            아티스트
          </button>
          <button
            className={`text-sm whitespace-nowrap pb-2 transition-colors ${activeTab === 'albums' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-400'}`}
            onClick={() => setActiveTab('albums')}
          >
            앨범
          </button>
          <button
            className={`text-sm whitespace-nowrap pb-2 transition-colors ${activeTab === 'playlists' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-400'}`}
            onClick={() => setActiveTab('playlists')}
          >
            플레이리스트
          </button>
          <button
            className={`text-sm whitespace-nowrap pb-2 transition-colors ${activeTab === 'community' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-400'}`}
            onClick={() => setActiveTab('community')}
          >
            커뮤니티
          </button>
        </div>
      </div>

      {/* 장르 카드 섹션 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">장르 탐색</h3>
          <button className="text-sm text-orange-500">모두 보기</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {genreCards.map((genre) => (
            <div
              key={genre.id}
              className={`bg-gradient-to-br ${genre.color} rounded-xl p-5 aspect-square flex flex-col justify-between cursor-pointer transform transition hover:scale-105`}
            >
              <div className="text-lg font-bold text-white">{genre.name}</div>
              <div className="text-sm text-white/80">곡 {genre.songs}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 트렌딩 노래 섹션 */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">트렌딩 노래</h3>
        </div>
        <div className="bg-zinc-800 rounded-xl overflow-hidden">
          {trendingSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
            >
              <div className="w-6 text-center text-gray-400 mr-3">{index + 1}</div>
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="ml-4 flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{song.title}</div>
                <div className="text-xs text-gray-400 mt-1">{song.artist}</div>
              </div>
              <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  <span>{song.plays}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{song.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 최신 발매 및 인기 게시글 그리드 */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 최신 발매 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-white">최신 발매</h3>
          </div>
          <div className="bg-zinc-800 rounded-xl overflow-hidden">
            {recentReleases.map((song) => (
              <div
                key={song.id}
                className="flex items-center p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="ml-4 flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{song.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{song.artist}</div>
                </div>
                <div className="bg-orange-500/20 text-xs font-medium text-orange-500 px-2 py-1 rounded-full ml-2">
                  NEW
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 게시글 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-white">인기 게시글</h3>
          </div>
          <div className="bg-zinc-800 rounded-xl overflow-hidden">
            {popularPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
              >
                <div className="flex items-center">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{post.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <UserCircle className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{post.author}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-300 line-clamp-2">{post.excerpt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
