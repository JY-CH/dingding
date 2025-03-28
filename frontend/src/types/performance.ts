export interface ChordNote {
  id: number;
  chord: string;
  position: number; // 1-4 위치
  timing: number;   // 밀리초 단위의 타이밍
} 