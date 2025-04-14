export interface ChordScore {
  chordType: string;
  score: string;
}

export interface Replay {
  replayId: number;
  SongTitle: string;
  score: number;
  mode: string;
  videoPath: string;
  practiceDate: string;
}

export interface DashboardData {
  userId: number;
  username: string;
  playtime: string; // 수정: number → string
  playtimeRank: number;
  totalTry: number;
  totalTryRank: number;
  chordScore: ChordScore[];
  replay: Replay[];
}
