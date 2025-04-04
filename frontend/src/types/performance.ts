export interface Note {
  id: number;
  stringNumber: number;  // 1-6번 줄
  position: number;      // 0-100 사이의 위치
  chord: string;         // 코드 이름 (예: E, A, D)
  timing: number;        // 노트가 나타날 시간 (밀리초)
  fret?: number;         // 프렛 위치 (선택적)
  duration?: number;     // 노트 지속 시간 (밀리초)
  isChord?: boolean;     // 코드의 일부인지 여부
  chordId?: number;      // 같은 코드에 속한 노트들의 그룹 ID
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  thumbnail: string;
  notes: Note[];
  bpm: number;          // 분당 비트 수
}

// 노트 히트 판정 결과
export interface HitResult {
  perfect: number;
  good: number;
  miss: number;
  combo: number;
  score: number;
  accuracy: number;     // 정확도 (0-100)
  maxCombo: number;     // 최대 콤보
}

// 히트 판정 타입
export type HitType = 'perfect' | 'good' | 'miss';

// 히트 판정 윈도우 설정
export interface HitWindow {
  perfect: number;  // Perfect 판정 범위 (밀리초)
  good: number;     // Good 판정 범위 (밀리초)
  miss: number;     // Miss 판정 범위 (밀리초)
}

// 난이도별 히트 윈도우 설정
export const HIT_WINDOWS: Record<string, HitWindow> = {
  easy: {
    perfect: 100,  // ±100ms
    good: 200,     // ±200ms
    miss: 300      // ±300ms
  },
  medium: {
    perfect: 80,   // ±80ms
    good: 160,     // ±160ms
    miss: 240      // ±240ms
  },
  hard: {
    perfect: 60,   // ±60ms
    good: 120,     // ±120ms
    miss: 180      // ±180ms
  }
};

// 코드 변경 타입
export interface ChordChange {
  id: number;
  chord: string;
  timing: number;
  strings: number[];     // 코드에 포함된 줄 번호들
  fretPositions: number[]; // 각 줄의 프렛 위치
}

// 노트 타입
export type NoteType = 'single' | 'chord' | 'slide' | 'hold'; 