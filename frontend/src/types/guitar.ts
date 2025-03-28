export interface GuitarChord {
  name: string;
  accuracy: number;
  timestamp: number;
}

export interface Performance {
  totalScore: number;
  accuracy: number;
  correctChords: number;
  totalChords: number;
  duration: number;
}

export interface FeedbackMessage {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface TunerData {
  note: string;          // 음표 (E, A, D, G, B, E)
  frequency: number;     // 주파수
  cents: number;         // 음정 차이 (-50 ~ +50)
  isInTune: boolean;     // 튜닝 상태
}

export interface MetronomeSettings {
  bpm: number;          // 템포
  timeSignature: {
    beats: number;      // 박자 수
    beatType: number;   // 박자 유형
  };
  isPlaying: boolean;
}

export interface ChordProgression {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chords: string[];
  bpm: number;
}

export interface AnalysisResult {
  strumPattern: {
    type: 'down' | 'up' | 'none';
    timing: number;
    accuracy: number;
  };
  timing: {
    ahead: number;      // 빠르기 (ms)
    behind: number;     // 느리기 (ms)
  };
  volume: number;       // 음량 (0-1)
}

export interface GuitarString {
  note: string;
  frequency: number;
  octave: number;
  isPlaying: boolean;
  intensity: number;  // 0-1 사이의 연주 강도
}

export interface Visualization {
  type: 'waveform' | 'frequency' | '3d';
  data: number[];
  peak: number;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'chord' | 'scale' | 'rhythm' | 'song';
  bpm: number;
  duration: number;
  description: string;
  requirements: string[];
  chords: string[];
  thumbnail: string;
}

export interface PracticeSession {
  id: string;
  startTime: Date;
  endTime: Date;
  exerciseId: string;
  performance: Performance;
  recordings: {
    timestamp: number;
    audioUrl: string;
    score: number;
  }[];
}

export interface UserSettings {
  preferredTuning: string[];
  metronomeSound: 'click' | 'bell' | 'drum';
  visualizationType: Visualization['type'];
  showFretboardGuide: boolean;
  webcamMirrored: boolean;
  autoRecording: boolean;
} 