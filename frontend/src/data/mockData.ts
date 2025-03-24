import { Song, Artist, Category } from '../types';

// 더미 음악 데이터
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    cover: 'https://i.scdn.co/image/ab67616d0000b27301f1d35d045186e5c8c05a50',
    audio: 'https://p.scdn.co/mp3-preview/3b6ca99899bde6cb316cf54408492e4c1dc25cfa',
    duration: 203,
    plays: 2543789
  },
  {
    id: '2',
    title: 'Hype Boy',
    artist: 'NewJeans',
    album: 'NewJeans 1st EP',
    cover: 'https://i.scdn.co/image/ab67616d0000b2736ec634e5fa8d4b54d661baa7',
    audio: 'https://p.scdn.co/mp3-preview/63da2a4d8aa8b75fd343b14f34c3781391a5ed75',
    duration: 180,
    plays: 1987654
  },
  {
    id: '3',
    title: 'Seven (feat. Latto)',
    artist: 'Jung Kook',
    album: 'Seven',
    cover: 'https://i.scdn.co/image/ab67616d0000b273bf5cce5a0e1ed03a626bdd74',
    audio: 'https://p.scdn.co/mp3-preview/f95eb3c9ad10f7023e11dd7bf5f1c56e3a1c1d5a',
    duration: 194,
    plays: 3254871
  },
  {
    id: '4',
    title: 'Cupid',
    artist: 'FIFTY FIFTY',
    album: 'The Beginning: Cupid',
    cover: 'https://i.scdn.co/image/ab67616d0000b273849b5b629ce9aceb822f7905',
    audio: 'https://p.scdn.co/mp3-preview/d6176a405b15a37b2c1990033e0c7b76f5341cf1',
    duration: 175,
    plays: 1654236
  },
  {
    id: '5',
    title: 'OMG',
    artist: 'NewJeans',
    album: 'NewJeans OMG',
    cover: 'https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01',
    audio: 'https://p.scdn.co/mp3-preview/01fcba517920b800e1f2f88ff85b6857c0c5b86e',
    duration: 188,
    plays: 2145879
  }
];

// 인기 음악
export const mockTopSongs: Song[] = [
  ...mockSongs,
  {
    id: '6',
    title: 'Smoke',
    artist: 'Dynamic Duo, Choiza, Gaeko, Mirani',
    album: 'Smoke',
    cover: 'https://i.scdn.co/image/ab67616d0000b273c8d3b11fd5331c5c3abac16a',
    audio: 'https://p.scdn.co/mp3-preview/1da5e978fec7dfc0a8fecc60fa74be0f5a35eddb',
    duration: 205,
    plays: 1452658
  },
  {
    id: '7',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
    audio: 'https://p.scdn.co/mp3-preview/7abadf7d5df52920b127b12f9aaeb06a9a362b5d',
    duration: 210,
    plays: 4523698
  },
  {
    id: '8',
    title: 'Dangerously',
    artist: 'Charlie Puth',
    album: 'Nine Track Mind',
    cover: 'https://i.scdn.co/image/ab67616d0000b273633a2d775747bccfbcb17a45',
    audio: 'https://p.scdn.co/mp3-preview/f1dfc756f2facb45c9e30ce0a9078cc876513ff4',
    duration: 198,
    plays: 1856974
  }
];

// 일별 인기곡
export const mockDailyTracks: Song[] = mockSongs.slice(0, 5);

// 주간 인기곡
export const mockWeeklyTracks: Song[] = [
  mockSongs[2],
  mockSongs[0],
  mockSongs[4],
  mockSongs[1],
  mockSongs[3]
];

// 월간 인기곡
export const mockMonthlyTracks: Song[] = [
  mockSongs[3],
  mockSongs[1],
  mockSongs[2],
  mockSongs[4],
  mockSongs[0]
];

// 인기 아티스트
export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'NewJeans',
    image: 'https://i.scdn.co/image/ab6761610000e5eb42f6aa1e748206bbf3d2a3e4',
    followers: 2564789,
    genres: ['K-Pop', 'Pop']
  },
  {
    id: '2',
    name: 'The Weeknd',
    image: 'https://i.scdn.co/image/ab6761610000e5ebe5541c2f2ff9d6ff868e221f',
    followers: 8954321,
    genres: ['R&B', 'Pop']
  },
  {
    id: '3',
    name: 'Jung Kook',
    image: 'https://i.scdn.co/image/ab6761610000e5ebb1072333f5da991666613775',
    followers: 4125698,
    genres: ['K-Pop', 'Pop']
  },
  {
    id: '4',
    name: 'FIFTY FIFTY',
    image: 'https://i.scdn.co/image/ab6761610000e5eb4d1fea9353f28d38f2c3ebcf',
    followers: 1285634,
    genres: ['K-Pop', 'Pop']
  },
  {
    id: '5',
    name: 'Taylor Swift',
    image: 'https://i.scdn.co/image/ab6761610000e5eb6a224073987b930f99adc706',
    followers: 12458963,
    genres: ['Pop', 'Country']
  }
];

// 쇼츠 영상
export const mockShorts = [
  {
    id: '1',
    title: 'NewJeans - Hype Boy (Dance Challenge)',
    artist: 'NewJeans',
    thumbnail: 'https://i.ytimg.com/vi/HHUo8n5HI8o/maxresdefault.jpg',
    duration: '0:31'
  },
  {
    id: '2',
    title: 'Jung Kook - Seven (Backstage)',
    artist: 'Jung Kook',
    thumbnail: 'https://i.ytimg.com/vi/NPQMoaNfvWg/maxresdefault.jpg',
    duration: '0:45'
  },
  {
    id: '3',
    title: 'FIFTY FIFTY - Cupid (Studio Session)',
    artist: 'FIFTY FIFTY',
    thumbnail: 'https://i.ytimg.com/vi/9bJcMz6crLE/maxresdefault.jpg',
    duration: '0:28'
  },
  {
    id: '4',
    title: 'The Weeknd - Blinding Lights (Live)',
    artist: 'The Weeknd',
    thumbnail: 'https://i.ytimg.com/vi/Mbd4GHyfvy4/maxresdefault.jpg',
    duration: '0:37'
  },
  {
    id: '5',
    title: 'Taylor Swift - Anti-Hero (Exclusive Clip)',
    artist: 'Taylor Swift',
    thumbnail: 'https://i.ytimg.com/vi/bXArJgvLx9g/maxresdefault.jpg',
    duration: '0:25'
  }
];

// 카테고리
export const mockCategories: Category[] = [
  {
    id: '1',
    title: '릴렉스',
    cover: 'https://i.scdn.co/image/ab67706f000000035337e18dc6803780d806efba',
    color: 'from-blue-500 to-purple-500',
    count: 120
  },
  {
    id: '2',
    title: '힙합',
    cover: 'https://i.scdn.co/image/ab67706f00000003c0b86e4b8c8f6b45b5af000a',
    color: 'from-purple-500 to-pink-500',
    count: 158
  },
  {
    id: '3',
    title: '운동',
    cover: 'https://i.scdn.co/image/ab67706f00000003b3918722752d5d849a0c283c',
    color: 'from-green-500 to-teal-500',
    count: 87
  },
  {
    id: '4',
    title: '파티',
    cover: 'https://i.scdn.co/image/ab67706f00000003ec698a53ba8391b65e694899',
    color: 'from-amber-500 to-orange-500',
    count: 135
  }
]; 