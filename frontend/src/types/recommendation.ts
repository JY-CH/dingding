export interface RecommendSong {
  recommendSongId: number;
  song: {
    songId: number;
    songTitle: string;
    songSinger: string;
    songImage: string;
    songVoiceFileUrl: string;
    songDuration: string;
    songWriter: string;
    releaseDate: string;
    category: string;
  };
  severity: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
} 