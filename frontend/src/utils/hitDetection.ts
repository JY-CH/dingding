import { Note, HitType, HitWindow, ChordChange } from '../types/performance';

// 노트와 입력 시간의 차이를 계산
export const calculateTimingDifference = (note: Note, inputTime: number): number => {
  return Math.abs(note.timing - inputTime);
};

// 히트 판정 결과 계산
export const calculateHitResult = (
  timingDiff: number,
  hitWindow: HitWindow
): HitType => {
  if (timingDiff <= hitWindow.perfect) {
    return 'perfect';
  } else if (timingDiff <= hitWindow.good) {
    return 'good';
  } else if (timingDiff <= hitWindow.miss) {
    return 'miss';
  }
  return 'miss';
};

// 정확도 계산 (0-100)
export const calculateAccuracy = (timingDiff: number, hitWindow: HitWindow): number => {
  if (timingDiff <= hitWindow.perfect) {
    return 100;
  } else if (timingDiff <= hitWindow.good) {
    return 75;
  } else if (timingDiff <= hitWindow.miss) {
    return 50;
  }
  return 0;
};

// 점수 계산
export const calculateScore = (
  hitType: HitType,
  combo: number,
  baseScore: number = 100
): number => {
  const comboMultiplier = Math.min(combo / 10, 2); // 최대 2배까지
  const hitMultiplier = {
    perfect: 1,
    good: 0.5,
    miss: 0
  }[hitType];

  return Math.floor(baseScore * hitMultiplier * comboMultiplier);
};

// 가장 가까운 노트 찾기
export const findNearestNote = (
  notes: Note[],
  stringNumber: number,
  currentTime: number,
  hitWindow: HitWindow
): Note | null => {
  return notes
    .filter(note => note.stringNumber === stringNumber)
    .reduce((nearest, note) => {
      const timingDiff = calculateTimingDifference(note, currentTime);
      if (timingDiff <= hitWindow.miss) {
        if (!nearest || timingDiff < calculateTimingDifference(nearest, currentTime)) {
          return note;
        }
      }
      return nearest;
    }, null as Note | null);
};

// 코드 변경 찾기
export const findChordChange = (
  notes: Note[],
  currentTime: number,
  hitWindow: HitWindow
): ChordChange | null => {
  const chordNotes = notes.filter(note => note.isChord);
  if (chordNotes.length === 0) return null;

  // 같은 chordId를 가진 노트들을 그룹화
  const chordGroups = chordNotes.reduce((groups, note) => {
    if (!note.chordId) return groups;
    if (!groups[note.chordId]) {
      groups[note.chordId] = [];
    }
    groups[note.chordId].push(note);
    return groups;
  }, {} as Record<number, Note[]>);

  // 가장 가까운 코드 변경 찾기
  let nearestChord: ChordChange | null = null;
  let minTimingDiff = Infinity;

  Object.values(chordGroups).forEach(group => {
    if (group.length === 0) return;
    
    const timingDiff = calculateTimingDifference(group[0], currentTime);
    if (timingDiff <= hitWindow.miss && timingDiff < minTimingDiff) {
      minTimingDiff = timingDiff;
      nearestChord = {
        id: group[0].chordId!,
        chord: group[0].chord,
        timing: group[0].timing,
        strings: group.map(note => note.stringNumber),
        fretPositions: group.map(note => note.fret || 0)
      };
    }
  });

  return nearestChord;
};

// 코드 변경 판정
export const calculateChordHitResult = (
  chord: ChordChange,
  pressedStrings: number[],
  currentTime: number,
  hitWindow: HitWindow
): HitType => {
  const timingDiff = Math.abs(chord.timing - currentTime);
  
  // 모든 필요한 줄이 눌렸는지 확인
  const allStringsPressed = chord.strings.every(string => 
    pressedStrings.includes(string)
  );
  
  // 불필요한 줄이 눌렸는지 확인
  const extraStringsPressed = pressedStrings.some(string => 
    !chord.strings.includes(string)
  );

  if (timingDiff <= hitWindow.perfect && allStringsPressed && !extraStringsPressed) {
    return 'perfect';
  } else if (timingDiff <= hitWindow.good && allStringsPressed && !extraStringsPressed) {
    return 'good';
  }
  return 'miss';
}; 