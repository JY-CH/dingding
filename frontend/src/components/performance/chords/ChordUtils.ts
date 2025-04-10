import { Note } from '../../../types/performance';

// 코드별 노트 위치 정보 정의
interface ChordNotePosition {
  stringNumber: number;
  position: number;
  offset: number;
  fret: number;
}

// 코드 데이터 정의
interface ChordData {
  [key: string]: ChordNotePosition[];
}

// 모든 코드의 노트 위치 정보
export const chordData: ChordData = {
  'C': [
    { stringNumber: 2, position: 100, offset: 5, fret: 3 },
    { stringNumber: 3, position: 100, offset: 0, fret: 2 },
    { stringNumber: 5, position: 100, offset: -5, fret: 1 }
  ],
  'Cm': [
    { stringNumber: 2, position: 100, offset: 5, fret: 3 },
    { stringNumber: 3, position: 100, offset: 0, fret: 1 },
    { stringNumber: 5, position: 100, offset: -5, fret: 3 }
  ],
  'D': [
    { stringNumber: 4, position: 100, offset: -5, fret: 2 },
    { stringNumber: 6, position: 100, offset: 0, fret: 3 },
    { stringNumber: 5, position: 100, offset: 5, fret: 2 }
  ],
  'Dm': [
    { stringNumber: 1, position: 100, offset: -5, fret: 1 },
    { stringNumber: 2, position: 100, offset: 0, fret: 3 },
    { stringNumber: 3, position: 100, offset: 5, fret: 2 }
  ],
  'E': [
    { stringNumber: 3, position: 100, offset: 5, fret: 1 },
    { stringNumber: 4, position: 100, offset: 0, fret: 2 },
    { stringNumber: 5, position: 100, offset: -5, fret: 2 }
  ],
  'Em': [
    { stringNumber: 4, position: 100, offset: 0, fret: 2 },
    { stringNumber: 5, position: 100, offset: -5, fret: 2 }
  ],
  'F': [
    { stringNumber: 1, position: 100, offset: -5, fret: 1 },
    { stringNumber: 2, position: 100, offset: 0, fret: 1 },
    { stringNumber: 3, position: 100, offset: 5, fret: 2 },
    { stringNumber: 4, position: 100, offset: 0, fret: 3 }
  ],
  'Fm': [
    { stringNumber: 1, position: 100, offset: -5, fret: 1 },
    { stringNumber: 2, position: 100, offset: 0, fret: 1 },
    { stringNumber: 3, position: 100, offset: 5, fret: 1 },
    { stringNumber: 4, position: 100, offset: 0, fret: 3 }
  ],
  'G': [
    { stringNumber: 2, position: 100, offset: -5, fret: 3 },
    { stringNumber: 1, position: 100, offset: 0, fret: 2 },
    { stringNumber: 6, position: 100, offset: 5, fret: 3 }
  ],
  'Gm': [
    { stringNumber: 1, position: 100, offset: -5, fret: 3 },
    { stringNumber: 2, position: 100, offset: 0, fret: 3 },
    { stringNumber: 5, position: 100, offset: 5, fret: 3 }
  ],
  'A': [
    { stringNumber: 3, position: 100, offset: -5, fret: 2 },
    { stringNumber: 4, position: 100, offset: 0, fret: 2 },
    { stringNumber: 5, position: 100, offset: 5, fret: 2 }
  ],
  'Am': [
    { stringNumber: 4, position: 100, offset: 5, fret: 1 },
    { stringNumber: 3, position: 100, offset: 0, fret: 2 },
    { stringNumber: 5, position: 100, offset: -5, fret: 2 }
  ],
  'B': [
    { stringNumber: 1, position: 100, offset: -5, fret: 2 },
    { stringNumber: 2, position: 100, offset: 0, fret: 4 },
    { stringNumber: 3, position: 100, offset: 5, fret: 4 },
    { stringNumber: 4, position: 100, offset: 0, fret: 4 }
  ],
  'Bm': [
    { stringNumber: 1, position: 100, offset: -5, fret: 2 },
    { stringNumber: 2, position: 100, offset: 0, fret: 3 },
    { stringNumber: 3, position: 100, offset: 5, fret: 4 },
    { stringNumber: 4, position: 100, offset: 0, fret: 4 }
  ]
};

// 코드 노트 생성 함수 (일반)
export const createChordNote = (
  chord: string, 
  setTestNotes: React.Dispatch<React.SetStateAction<Note[]>>,
  setShadowNotes: React.Dispatch<React.SetStateAction<Note[]>>
) => {
  if (!chordData[chord]) {
    console.warn(`코드 데이터를 찾을 수 없습니다: ${chord}`);
    return;
  }

  const chordNotes = chordData[chord];
  const baseId = Math.floor(Date.now() / 1000) * 1000; // 1초 단위로 ID 생성

  const newNotes = chordNotes.map((note, index) => ({
    id: baseId + index + 100, // 노트와 그림자 노트 ID 충돌 방지
    stringNumber: note.stringNumber,
    position: note.position + note.offset,
    timing: Date.now(),
    isChord: true,
    chord: chord,
    fret: note.fret
  }));

  // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 코드 손모양 유지)
  setShadowNotes(chordNotes.map((note, index) => ({
    id: baseId + index, // 고정된 ID 구조 사용
    stringNumber: note.stringNumber,
    position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
    timing: Date.now(),
    isChord: true,
    chord: chord,
    fret: note.fret
  })));
  
  setTestNotes(prev => [...prev, ...newNotes]);
};

// 타이밍 정보를 포함한 코드 노트 생성 함수
export const createChordNoteWithTiming = (
  chord: string,
  sheetOrder: number,
  setTestNotes: React.Dispatch<React.SetStateAction<Note[]>>,
  setShadowNotes: React.Dispatch<React.SetStateAction<Note[]>>
) => {
  if (!chordData[chord]) {
    console.warn(`코드 데이터를 찾을 수 없습니다: ${chord}`);
    return;
  }

  const chordNotes = chordData[chord];
  const baseId = Math.floor(Date.now() / 1000) * 1000; // 1초 단위로 ID 생성

  const newNotes = chordNotes.map((note, index) => ({
    id: baseId + index + 100, // 노트와 그림자 노트 ID 충돌 방지
    stringNumber: note.stringNumber,
    position: note.position + note.offset,
    timing: sheetOrder, // sheetOrder를 타이밍 정보로 사용
    isChord: true,
    chord: chord,
    fret: note.fret
  }));

  setShadowNotes(chordNotes.map((note, index) => ({
    id: baseId + index, // 고정된 ID 구조 사용
    stringNumber: note.stringNumber,
    position: 30 + (note.offset * 0.7), // 오프셋 범위를 줄여서 모든 노트가 민트색 영역 안에 들어가도록 조정
    timing: sheetOrder,
    isChord: true,
    chord: chord,
    fret: note.fret
  })));
  
  setTestNotes(prev => [...prev, ...newNotes]);
};

// 그림자 생성 없이 코드 노트만 생성하는 함수
export const createChordNoteWithoutShadow = (
  chord: string, 
  setTestNotes: React.Dispatch<React.SetStateAction<Note[]>>
) => {
  if (!chordData[chord]) {
    console.warn(`코드 데이터를 찾을 수 없습니다: ${chord}`);
    return;
  }

  const chordNotes = chordData[chord];
  const baseId = Math.floor(Date.now() / 1000) * 1000; // 1초 단위로 ID 생성

  const newNotes = chordNotes.map((note, index) => ({
    id: baseId + index,
    stringNumber: note.stringNumber,
    position: note.position + note.offset,
    timing: Date.now(),
    isChord: true,
    chord: chord,
    fret: note.fret
  }));
  
  setTestNotes(prev => [...prev, ...newNotes]);
};

// 타이밍 정보를 포함하여 그림자 생성 없이 코드 노트만 생성하는 함수
export const createChordNoteWithTimingWithoutShadow = (
  chord: string,
  sheetOrder: number,
  setTestNotes: React.Dispatch<React.SetStateAction<Note[]>>
) => {
  if (!chordData[chord]) {
    console.warn(`코드 데이터를 찾을 수 없습니다: ${chord}`);
    return;
  }

  const chordNotes = chordData[chord];
  const baseId = Math.floor(Date.now() / 1000) * 1000; // 1초 단위로 ID 생성

  const newNotes = chordNotes.map((note, index) => ({
    id: baseId + index,
    stringNumber: note.stringNumber,
    position: note.position + note.offset,
    timing: sheetOrder, // sheetOrder를 타이밍 정보로 사용
    isChord: true,
    chord: chord,
    fret: note.fret
  }));
  
  setTestNotes(prev => [...prev, ...newNotes]);
}; 