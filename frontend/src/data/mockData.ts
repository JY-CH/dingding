import { Artist, Category } from '../types';
import { Song } from '../types/performance';

// 더미 음악 데이터
export const mockSongs: Song[] = [
  {
    id: 1,
    songId: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    difficulty: 'medium',
    duration: '3:23',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b27301f1d35d045186e5c8c05a50',
    notes: [],
    bpm: 120,
    songTitle: 'Blinding Lights',
    songImage: 'https://i.scdn.co/image/ab67616d0000b27301f1d35d045186e5c8c05a50',
    songWriter: 'The Weeknd',
    songSinger: 'The Weeknd',
    songVoiceFileUrl: '',
    releaseDate: '2020-01-01',
    category: 'Pop',
    songDuration: '3:23'
  },
  {
    id: 2,
    songId: 2,
    title: 'Hype Boy',
    artist: 'NewJeans',
    difficulty: 'easy',
    duration: '3:00',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b2736ec634e5fa8d4b54d661baa7',
    notes: [],
    bpm: 110,
    songTitle: 'Hype Boy',
    songImage: 'https://i.scdn.co/image/ab67616d0000b2736ec634e5fa8d4b54d661baa7',
    songWriter: 'NewJeans',
    songSinger: 'NewJeans',
    songVoiceFileUrl: '',
    releaseDate: '2022-08-01',
    category: 'K-Pop',
    songDuration: '3:00'
  },
  {
    id: 3,
    songId: 3,
    title: 'Seven (feat. Latto)',
    artist: 'Jung Kook',
    difficulty: 'hard',
    duration: '3:14',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273bf5cce5a0e1ed03a626bdd74',
    notes: [],
    bpm: 125,
    songTitle: 'Seven (feat. Latto)',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273bf5cce5a0e1ed03a626bdd74',
    songWriter: 'Jung Kook',
    songSinger: 'Jung Kook',
    songVoiceFileUrl: '',
    releaseDate: '2023-07-14',
    category: 'K-Pop',
    songDuration: '3:14'
  },
  {
    id: 4,
    songId: 4,
    title: 'Cupid',
    artist: 'FIFTY FIFTY',
    difficulty: 'medium',
    duration: '2:55',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273849b5b629ce9aceb822f7905',
    notes: [],
    bpm: 115,
    songTitle: 'Cupid',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273849b5b629ce9aceb822f7905',
    songWriter: 'FIFTY FIFTY',
    songSinger: 'FIFTY FIFTY',
    songVoiceFileUrl: '',
    releaseDate: '2023-02-24',
    category: 'K-Pop',
    songDuration: '2:55'
  },
  {
    id: 5,
    songId: 5,
    title: 'OMG',
    artist: 'NewJeans',
    difficulty: 'medium',
    duration: '3:08',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01',
    notes: [],
    bpm: 118,
    songTitle: 'OMG',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01',
    songWriter: 'NewJeans',
    songSinger: 'NewJeans',
    songVoiceFileUrl: '',
    releaseDate: '2023-01-02',
    category: 'K-Pop',
    songDuration: '3:08'
  }
];

// 인기 음악
export const mockTopSongs: Song[] = [
  ...mockSongs,
  {
    id: 6,
    songId: 6,
    title: 'Smoke',
    artist: 'Dynamic Duo, Choiza, Gaeko, Mirani',
    difficulty: 'hard',
    duration: '3:25',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273c8d3b11fd5331c5c3abac16a',
    notes: [],
    bpm: 128,
    songTitle: 'Smoke',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273c8d3b11fd5331c5c3abac16a',
    songWriter: 'Dynamic Duo',
    songSinger: 'Dynamic Duo, Choiza, Gaeko, Mirani',
    songVoiceFileUrl: '',
    releaseDate: '2022-05-15',
    category: 'K-Hip-Hop',
    songDuration: '3:25'
  },
  {
    id: 7,
    songId: 7,
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    difficulty: 'medium',
    duration: '3:30',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
    notes: [],
    bpm: 122,
    songTitle: 'Anti-Hero',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
    songWriter: 'Taylor Swift',
    songSinger: 'Taylor Swift',
    songVoiceFileUrl: '',
    releaseDate: '2022-10-21',
    category: 'Pop',
    songDuration: '3:30'
  },
  {
    id: 8,
    songId: 8,
    title: 'Dangerously',
    artist: 'Charlie Puth',
    difficulty: 'easy',
    duration: '3:18',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273633a2d775747bccfbcb17a45',
    notes: [],
    bpm: 116,
    songTitle: 'Dangerously',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273633a2d775747bccfbcb17a45',
    songWriter: 'Charlie Puth',
    songSinger: 'Charlie Puth',
    songVoiceFileUrl: '',
    releaseDate: '2016-11-11',
    category: 'Pop',
    songDuration: '3:18'
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