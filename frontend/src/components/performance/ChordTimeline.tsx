import React, { useEffect, useState } from 'react';

import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2';
import { Song, Note, ChordChange } from '../../types/performance';

interface ChordTimelineProps {
  isPlaying: boolean;
  currentSong: Song | null;
  notes: Note[];
  currentChord: ChordChange | null;
}

const ChordTimeline: React.FC<ChordTimelineProps> = ({
  isPlaying,
  currentSong,
  notes = [],
  currentChord
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testNotes, setTestNotes] = useState<Note[]>([]);
  const [activeStrings, setActiveStrings] = useState<number[]>([]);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);

  const [shadowNotes, setShadowNotes] = useState<Note[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedChord, setSelectedChord] = useState<string>('C');

  const stringColors = [
    'rgba(251, 191, 36, 0.6)',   // 1번줄 - amber-400 (가장 얇은 줄)
    'rgba(251, 191, 36, 0.55)',  // 2번줄 - amber-400
    'rgba(251, 191, 36, 0.5)',   // 3번줄 - amber-400
    'rgba(192, 192, 192, 0.7)',  // 4번줄 - silver
    'rgba(192, 192, 192, 0.65)', // 5번줄 - silver
    'rgba(192, 192, 192, 0.6)',  // 6번줄 - silver
  ];

  // 각 줄의 두께 설정 (위에서 아래로 갈수록 두꺼워짐)
  const stringThickness = [
    3.5,  // 1번줄 (가장 두꺼운 줄)
    3,    // 2번줄
    2.5,  // 3번줄
    3,    // 4번줄
    2.5,  // 5번줄
    2,    // 6번줄 (가장 얇은 줄)
  ];

  // 각 줄의 위치를 직접 설정 (0% ~ 100% 사이의 값으로 설정)
  // 예시: 6번줄 0%, 5번줄 15%, 4번줄 30% ...
  // 여기서 각 줄의 위치를 직접 조정할 수 있습니다.
  // 0%는 가장 위쪽, 100%는 가장 아래쪽을 의미합니다.
  // 각 줄의 간격을 원하는 대로 조정하세요.
  const stringPositions = [
    85,   // 1번줄 위치 (최하단)
    70,   // 2번줄 위치
    55,   // 3번줄 위치
    40,   // 4번줄 위치
    25,   // 5번줄 위치
    10,   // 6번줄 위치 (최상단)
  ];

  // 줄 위치 계산 함수
  // 이 함수는 stringPositions 배열에서 해당 줄의 위치를 가져옵니다.
  // index는 0부터 시작하므로, 1번줄은 index 0, 2번줄은 index 1, ... 입니다.
  const getStringPosition = (index: number) => {
    return stringPositions[index];
  };

  // 움직이는 빛 효과를 위한 키프레임 정의
  const shimmerKeyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700&family=Teko:wght@500;600&display=swap');
    
    @keyframes shimmer {
      0% {
        background-position: 200% 50%;
      }
      100% {
        background-position: -200% 50%;
      }
    }
    
    @keyframes pulse {
      0% {
        opacity: 0.5;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      100% {
        opacity: 0.5;
        transform: scale(1);
      }
    }
    
    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-5px);
      }
      100% {
        transform: translateY(0px);
      }
    }
    
    @keyframes notePulse {
      0% {
        opacity: 0.8;
        transform: translate(-50%, -50%) perspective(1000px) rotateX(20deg) rotateY(10deg) scale(1);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) perspective(1000px) rotateX(20deg) rotateY(10deg) scale(1.05);
      }
      100% {
        opacity: 0.8;
        transform: translate(-50%, -50%) perspective(1000px) rotateX(20deg) rotateY(10deg) scale(1);
      }
    }
  `;

  // 테스트용 노트 생성 함수
  // const createTestNote = (stringNumber: number) => {
  //   const newNote: Note = {
  //     id: Date.now() + Math.random(),
  //     stringNumber,
  //     position: 100, // 오른쪽에서 시작
  //     timing: Date.now(),
  //     isChord: false,
  //     chord: '' // 빈 문자열로 초기화
  //   };
  //   setTestNotes(prev => [...prev, newNote]);
  // };

  // C코드 손모양 노트 생성 함수
  const createCChordNote = () => {
    const cChordNotes = [
      { stringNumber: 2, position: 100, offset: 5, fret: 3 },    // 2번 줄 (3번 프렛)
      { stringNumber: 3, position: 100, offset: 0, fret: 2 },    // 3번 줄 (2번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 1 }    // 5번 줄 (1번 프렛)
    ];

    const newNotes = cChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'C',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 C코드 손모양 유지)
    setShadowNotes(cChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'C',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // A코드 손모양 노트 생성 함수
  const createAChordNote = () => {
    const aChordNotes = [
      { stringNumber: 3, position: 100, offset: -5, fret: 2 },    // 3번 줄 (2번 프렛)
      { stringNumber: 4, position: 100, offset: 0, fret: 2 },    // 4번 줄 (2번 프렛)
      { stringNumber: 5, position: 100, offset: 5, fret: 2 }    // 5번 줄 (2번 프렛)
    ];

    const newNotes = aChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'A',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 A코드 손모양 유지)
    setShadowNotes(aChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'A',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Am 코드 손모양 노트 생성 함수
  const createAmChordNote = () => {
    const amChordNotes = [
      { stringNumber: 3, position: 100, offset: -5, fret: 2 },    // 3번 줄 (2번 프렛)
      { stringNumber: 4, position: 100, offset: 0, fret: 2 },    // 4번 줄 (2번 프렛)
      { stringNumber: 5, position: 100, offset: 5, fret: 1 }    // 5번 줄 (1번 프렛)
    ];

    const newNotes = amChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Am',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Am코드 손모양 유지)
    setShadowNotes(amChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Am',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // B 코드 손모양 노트 생성 함수
  const createBChordNote = () => {
    const bChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 2 },    // 1번 줄 (2번 프렛)
      { stringNumber: 3, position: 100, offset: 0, fret: 4 },    // 3번 줄 (4번 프렛)
      { stringNumber: 4, position: 100, offset: 5, fret: 4 },    // 4번 줄 (4번 프렛)
      { stringNumber: 5, position: 100, offset: 0, fret: 2 }    // 5번 줄 (2번 프렛)
    ];

    const newNotes = bChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'B',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 B코드 손모양 유지)
    setShadowNotes(bChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'B',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Bm 코드 손모양 노트 생성 함수
  const createBmChordNote = () => {
    const bmChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 2 },    // 1번 줄 (2번 프렛)
      { stringNumber: 3, position: 100, offset: 0, fret: 4 },    // 3번 줄 (4번 프렛)
      { stringNumber: 4, position: 100, offset: 5, fret: 3 },    // 4번 줄 (3번 프렛)
      { stringNumber: 5, position: 100, offset: 0, fret: 2 }    // 5번 줄 (2번 프렛)
    ];

    const newNotes = bmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Bm',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Bm코드 손모양 유지)
    setShadowNotes(bmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Bm',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Cm 코드 손모양 노트 생성 함수
  const createCmChordNote = () => {
    const cmChordNotes = [
      { stringNumber: 2, position: 100, offset: 5, fret: 3 },    // 2번 줄 (3번 프렛)
      { stringNumber: 3, position: 100, offset: 0, fret: 1 },    // 3번 줄 (1번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 3 }    // 5번 줄 (3번 프렛)
    ];

    const newNotes = cmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Cm',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Cm코드 손모양 유지)
    setShadowNotes(cmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Cm',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // D 코드 손모양 노트 생성 함수
  const createDChordNote = () => {
    const dChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 2 },    // 1번 줄 (2번 프렛)
      { stringNumber: 2, position: 100, offset: 0, fret: 3 },    // 2번 줄 (3번 프렛)
      { stringNumber: 3, position: 100, offset: 5, fret: 2 }     // 3번 줄 (2번 프렛)
    ];

    const newNotes = dChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'D',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 D코드 손모양 유지)
    setShadowNotes(dChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'D',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Dm 코드 손모양 노트 생성 함수
  const createDmChordNote = () => {
    const dmChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 1 },    // 1번 줄 (1번 프렛)
      { stringNumber: 2, position: 100, offset: 0, fret: 3 },    // 2번 줄 (3번 프렛)
      { stringNumber: 3, position: 100, offset: 5, fret: 2 }     // 3번 줄 (2번 프렛)
    ];

    const newNotes = dmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Dm',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Dm코드 손모양 유지)
    setShadowNotes(dmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Dm',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // E 코드 손모양 노트 생성 함수
  const createEChordNote = () => {
    const eChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 0 },    // 1번 줄 (0번 프렛 - 개방)
      { stringNumber: 2, position: 100, offset: 0, fret: 0 },     // 2번 줄 (0번 프렛 - 개방)
      { stringNumber: 3, position: 100, offset: 5, fret: 1 },     // 3번 줄 (1번 프렛)
      { stringNumber: 4, position: 100, offset: 0, fret: 2 },     // 4번 줄 (2번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 2 }     // 5번 줄 (2번 프렛)
    ];

    const newNotes = eChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'E',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 E코드 손모양 유지)
    setShadowNotes(eChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'E',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Em 코드 손모양 노트 생성 함수
  const createEmChordNote = () => {
    const emChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 0 },    // 1번 줄 (0번 프렛 - 개방)
      { stringNumber: 2, position: 100, offset: 0, fret: 0 },     // 2번 줄 (0번 프렛 - 개방)
      { stringNumber: 3, position: 100, offset: 5, fret: 0 },     // 3번 줄 (0번 프렛 - 개방)
      { stringNumber: 4, position: 100, offset: 0, fret: 2 },     // 4번 줄 (2번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 2 }     // 5번 줄 (2번 프렛)
    ];

    const newNotes = emChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Em',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Em코드 손모양 유지)
    setShadowNotes(emChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Em',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // F 코드 손모양 노트 생성 함수
  const createFChordNote = () => {
    const fChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 1 },    // 1번 줄 (1번 프렛)
      { stringNumber: 2, position: 100, offset: 0, fret: 1 },     // 2번 줄 (1번 프렛)
      { stringNumber: 3, position: 100, offset: 5, fret: 2 },     // 3번 줄 (2번 프렛)
      { stringNumber: 4, position: 100, offset: 0, fret: 3 },     // 4번 줄 (3번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 3 }     // 5번 줄 (3번 프렛)
    ];

    const newNotes = fChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'F',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 F코드 손모양 유지)
    setShadowNotes(fChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'F',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Fm 코드 손모양 노트 생성 함수
  const createFmChordNote = () => {
    const fmChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 1 },    // 1번 줄 (1번 프렛)
      { stringNumber: 2, position: 100, offset: 0, fret: 1 },     // 2번 줄 (1번 프렛)
      { stringNumber: 3, position: 100, offset: 5, fret: 1 },     // 3번 줄 (1번 프렛)
      { stringNumber: 4, position: 100, offset: 0, fret: 3 },     // 4번 줄 (3번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 3 }     // 5번 줄 (3번 프렛)
    ];

    const newNotes = fmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Fm',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Fm코드 손모양 유지)
    setShadowNotes(fmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Fm',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // G 코드 손모양 노트 생성 함수
  const createGChordNote = () => {
    const gChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 3 },    // 1번 줄 (3번 프렛)
      { stringNumber: 2, position: 100, offset: 0, fret: 0 },     // 2번 줄 (0번 프렛 - 개방)
      { stringNumber: 3, position: 100, offset: 5, fret: 0 },     // 3번 줄 (0번 프렛 - 개방)
      { stringNumber: 4, position: 100, offset: 0, fret: 0 },     // 4번 줄 (0번 프렛 - 개방)
      { stringNumber: 5, position: 100, offset: -5, fret: 2 },    // 5번 줄 (2번 프렛)
      { stringNumber: 6, position: 100, offset: 0, fret: 3 }      // 6번 줄 (3번 프렛)
    ];

    const newNotes = gChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'G',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 G코드 손모양 유지)
    setShadowNotes(gChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'G',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // Gm 코드 손모양 노트 생성 함수
  const createGmChordNote = () => {
    const gmChordNotes = [
      { stringNumber: 1, position: 100, offset: -5, fret: 3 },    // 1번 줄 (3번 프렛)
      { stringNumber: 2, position: 100, offset: 0, fret: 3 },     // 2번 줄 (3번 프렛)
      { stringNumber: 3, position: 100, offset: 5, fret: 3 },     // 3번 줄 (3번 프렛)
      { stringNumber: 4, position: 100, offset: 0, fret: 5 },     // 4번 줄 (5번 프렛)
      { stringNumber: 5, position: 100, offset: -5, fret: 5 }     // 5번 줄 (5번 프렛)
    ];

    const newNotes = gmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'Gm',
      fret: note.fret
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 Gm코드 손모양 유지)
    setShadowNotes(gmChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'Gm',
      fret: note.fret
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // 배속 변경 함수
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  // 테스트용 노트 이동 함수
  useEffect(() => {
    if (testNotes.length > 0) {
      const interval = setInterval(() => {
        setTestNotes(prevNotes => {
          const newNotes = prevNotes.map(note => ({
            ...note,
            position: note.position - (0.5 * playbackSpeed)
          })).filter(note => note.position > -10);

          // 노트가 타겟 라인(25%)에 도달했는지 확인하고 해당 줄 활성화
          const passedNotes = prevNotes.filter(note => 
            note.position > 25 && note.position - (0.5 * playbackSpeed) <= 25
          );
          
          if (passedNotes.length > 0) {
            const stringNumbers = passedNotes.map(note => note.stringNumber);
            setActiveStrings(stringNumbers);
            
            // 일정 시간 후 활성화 해제
            setTimeout(() => {
              setActiveStrings([]);
            }, 500);
          }

          // 모든 코드의 노트들이 민트색 바닥 영역(25% ~ 37.5%)을 지나쳤는지 확인
          if (shadowNotes.length > 0) {
            // 현재 표시 중인 코드 찾기
            const displayedChord = shadowNotes[0].chord;
            
            // 해당 코드의 모든 노트가 37.5% 위치를 지나쳤는지 확인
            const codeNotes = newNotes.filter(note => note.chord === displayedChord);
            
            if (codeNotes.length > 0) {
              const allNotesPassed = codeNotes.every(note => note.position <= 37.5);
              if (allNotesPassed) {
                setShadowNotes([]); // 그림자 제거
              }
            } else {
              // 해당 코드의 노트가 모두 사라졌으면 그림자도 제거
              setShadowNotes([]);
            }
          }

          return newNotes;
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [testNotes, playbackSpeed, shadowNotes]);

  // 노트가 지나갈 때 해당 줄을 활성화하는 효과
  useEffect(() => {
    if (isPlaying && currentSong && notes && notes.length > 0) {
      console.log('노트 애니메이션 시작');
      // 노트 애니메이션 시작
      const interval = setInterval(() => {
        setCurrentNotes(prevNotes => {
          const newNotes = prevNotes.map(note => ({
            ...note,
            position: note.position - (1 * playbackSpeed)
          })).filter(note => note.position > -10);

          // 노트가 타겟 라인(25%)에 도달했는지 확인하고 해당 줄 활성화
          const passedNotes = prevNotes.filter(note => 
            note.position > 25 && note.position - (1 * playbackSpeed) <= 25
          );
          
          if (passedNotes.length > 0) {
            const stringNumbers = passedNotes.map(note => note.stringNumber);
            setActiveStrings(stringNumbers);
            
            // 일정 시간 후 활성화 해제
            setTimeout(() => {
              setActiveStrings([]);
            }, 500);
          }

          // 새로운 노트 추가
          const newNotesToAdd = notes.filter(note => 
            note.timing <= Date.now() && 
            !prevNotes.find(n => n.id === note.id)
          );

          return [...newNotes, ...newNotesToAdd];
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong, notes, playbackSpeed]);

  const renderNote = (note: Note) => {
    // const isChordNote = note.isChord;
    // const isCurrentChord = currentChord && note.chordId === currentChord.id;
    const isOnTargetLine = Math.abs(note.position - 25) < 1;

  return (
      <div
        key={note.id}
        className="absolute w-10 h-10 rounded-full"
        style={{
          top: `${getStringPosition(note.stringNumber - 1)}%`,
          left: `${note.position}%`,
          transform: 'translate(-50%, -50%) perspective(1000px) rotateX(20deg) rotateY(10deg)',
          background: isOnTargetLine 
            ? 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 1) 0%, rgba(251, 191, 36, 0.9) 20%, rgba(251, 191, 36, 0.7) 40%, rgba(251, 191, 36, 0.4) 60%, transparent 100%)'
            : `radial-gradient(circle at 30% 30%, ${stringColors[note.stringNumber - 1].replace(')', ', 1)')} 0%, ${stringColors[note.stringNumber - 1].replace(')', ', 0.9)')} 20%, ${stringColors[note.stringNumber - 1].replace(')', ', 0.7)')} 40%, ${stringColors[note.stringNumber - 1].replace(')', ', 0.4)')} 60%, transparent 100%)`,
          animation: isOnTargetLine 
            ? 'noteHit 0.3s ease-in-out' 
            : 'notePulse 1s ease-in-out infinite',
          boxShadow: isOnTargetLine
            ? '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.8), 0 10px 20px rgba(0, 0, 0, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3)'
            : `0 0 15px ${stringColors[note.stringNumber - 1]}, 0 0 30px ${stringColors[note.stringNumber - 1]}, inset 0 0 15px ${stringColors[note.stringNumber - 1]}, 0 10px 20px rgba(0, 0, 0, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3)`,
          filter: 'brightness(1.2) contrast(1.2)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 노트의 3D 효과를 위한 추가 요소들 */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 70%)',
          transform: 'translateZ(2px)',
        }} />
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.2) 0%, transparent 70%)',
          transform: 'translateZ(-2px)',
        }} />
        {note.fret && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative" style={{ 
              transformStyle: 'preserve-3d',
              transform: 'scale(2) rotateX(15deg) rotateY(-15deg)',
              width: '30px',
              height: '30px'
            }}>
              {/* 앞면 - 메인 숫자 */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center" style={{ 
                transform: 'translateZ(6px)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                borderRadius: '4px',
                border: '3px solid #FFFFFF',
                boxShadow: 'inset 0 0 15px rgba(255,255,255,1), 0 0 15px rgba(0,0,0,0.7)'
              }}>
                <span className="text-black text-2xl" style={{ 
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: '0px 1px 2px rgba(255,255,255,1), 0px -1px 2px rgba(0,0,0,0.5)',
                  WebkitTextStroke: '0.5px rgba(0,0,0,0.7)',
                  filter: 'contrast(1.8) brightness(1.3)',
                  letterSpacing: '0px',
                  fontWeight: '500'
                }}>
                  {note.fret}
                </span>
              </div>
              
              {/* 위쪽 면 */}
              <div className="absolute top-0 left-0 w-full" style={{ 
                height: '6px',
                transform: 'rotateX(-90deg) translateZ(-6px)',
                transformOrigin: 'top',
                background: 'linear-gradient(to bottom, #FFFFFF 0%, #DDDDDD 100%)',
                borderRadius: '2px 2px 0 0',
                boxShadow: '0 -3px 6px rgba(0,0,0,0.5)'
              }} />
              
              {/* 오른쪽 면 */}
              <div className="absolute top-0 right-0 h-full" style={{ 
                width: '6px',
                transform: 'rotateY(90deg) translateZ(-6px)',
                transformOrigin: 'right',
                background: 'linear-gradient(to left, #DDDDDD 0%, #AAAAAA 100%)',
                borderRadius: '0 2px 2px 0',
                boxShadow: '3px 0 6px rgba(0,0,0,0.5)'
              }} />
              
              {/* 왼쪽 면 */}
              <div className="absolute top-0 left-0 h-full" style={{ 
                width: '6px',
                transform: 'rotateY(-90deg) translateZ(0px)',
                transformOrigin: 'left',
                background: 'linear-gradient(to right, #DDDDDD 0%, #AAAAAA 100%)',
                borderRadius: '2px 0 0 2px',
                boxShadow: '-3px 0 6px rgba(0,0,0,0.5)'
              }} />
              
              {/* 아래쪽 면 */}
              <div className="absolute bottom-0 left-0 w-full" style={{ 
                height: '6px',
                transform: 'rotateX(90deg) translateZ(0px)',
                transformOrigin: 'bottom',
                background: 'linear-gradient(to top, #AAAAAA 0%, #888888 100%)',
                borderRadius: '0 0 2px 2px',
                boxShadow: '0 3px 6px rgba(0,0,0,0.5)'
              }} />
            </div>
            
            {/* 그림자 효과 */}
            <div className="absolute top-1/2 left-1/2 w-12 h-4" style={{
              transform: 'translate(-50%, 15px) rotateX(90deg) scale(1.3, 0.8)',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(2px)',
              zIndex: -1
            }} />
          </div>
        )}
      </div>
    );
  };

  // 전체화면 모드 토글 함수
  const toggleFullscreen = () => {
    setIsExpanded(!isExpanded);
  };

  const renderTimelineContent = () => (
    <>
      <style>
        {shimmerKeyframes}
        {`
          @keyframes shadowPulse {
            0% {
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
      <div className="absolute inset-0"
           style={{
             perspective: '2000px',
             perspectiveOrigin: '50% 30%'
           }}>
        
        {/* 벽면 (상단 50%) */}
        <div 
          className="absolute top-0 w-full h-[50%]"
          style={{
            background: 'linear-gradient(to bottom, #2d2d2d, #3d3d3d)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* 수직선만 남기고 가로선 제거 */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-[1px]"
              style={{
                left: `${12.5 + i * 12.5}%`,
                background: i === 1 || i === 2
                  ? 'linear-gradient(180deg, rgba(52, 211, 153, 1), rgba(52, 211, 153, 0.8))'
                  : 'linear-gradient(180deg, transparent, rgba(251, 191, 36, 0.8))',
                opacity: i === 1 || i === 2 ? 0.9 : 0.6,
                boxShadow: i === 1 || i === 2
                  ? '0 0 15px rgba(52, 211, 153, 0.7), 0 0 30px rgba(52, 211, 153, 0.4)' 
                  : 'none',
              }}
            />
          ))}
        </div>

        {/* 바닥면 (하단 50% + 확장) */}
        <div 
          className="absolute top-[49.9%] w-full"
          style={{
            height: '280%',
            background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a, #2d2d2d)',
            transform: 'rotateX(80.5deg)',
            transformOrigin: 'top',
            transformStyle: 'preserve-3d',
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* 기타 줄 */}
          <div className="absolute top-0 left-0 w-full h-[50%]">
            {/* 프렛 구분선 */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`fret-${i}`}
                className="absolute h-full w-[12.5%]"
                style={{
                  left: `${i * 12.5}%`,
                  background: i === 2
                    ? 'linear-gradient(to bottom, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.05))'
                    : i % 2 === 0 
                      ? 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)' 
                      : 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
                  boxShadow: i === 2
                    ? '0 8px 16px rgba(52, 211, 153, 0.15)'
                    : '0 8px 16px rgba(0, 0, 0, 0.8)',
                  transform: 'translateZ(20px)',
                  height: '120%',
                }}
              />
            ))}

            {/* 프렛 하단 테두리 */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[2px]"
              style={{
                background: '#000000',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            />

            {/* 프렛과 바닥면 사이의 검정색 박스 */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[40px]"
              style={{
                background: '#000000',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            />

            {stringColors.map((color, i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{
                  top: `${getStringPosition(i)}%`,
                  height: `${stringThickness[i]}px`,
                  background: i < 3 
                    ? `repeating-linear-gradient(90deg, 
                        ${color} 0px, 
                        ${color} ${stringThickness[i] / 2}px, 
                        rgba(251, 191, 36, 0.75) ${stringThickness[i] / 2}px, 
                        rgba(251, 191, 36, 0.75) ${stringThickness[i]}px
                      )`
                    : color,
                  backgroundSize: i < 3 ? `${stringThickness[i]}px 100%` : 'auto',
                  animation: activeStrings.includes(i + 1) 
                    ? 'pulse 0.5s ease-in-out' 
                    : 'none',
                  boxShadow: activeStrings.includes(i + 1)
                    ? `0 0 20px ${color}, 0 0 40px ${color.replace(')', ', 0.7)')}, 0 0 60px ${color.replace(')', ', 0.4)')}`
                    : `0 0 15px ${color}, 0 0 30px ${color.replace(')', ', 0.5)')}, 0 0 45px ${color.replace(')', ', 0.25)')}`,
                  transform: activeStrings.includes(i + 1) ? 'scaleY(1.5)' : 'scaleY(1)',
                  transition: 'all 0.3s ease',
                  borderRadius: '50%',
                }}
              />
            ))}

            {/* 그림자 노트 */}
            {shadowNotes.length > 0 && shadowNotes.map((note) => (
              <div
                key={`shadow-${note.id}`}
                className="absolute w-10 h-10 rounded-full"
                style={{
                  top: `${getStringPosition(note.stringNumber - 1)}%`,
                  left: `${note.position}%`,
                  transform: 'translate(-50%, -50%) perspective(1000px) rotateX(20deg)',
                  background: 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.9) 0%, rgba(251, 191, 36, 0.7) 20%, rgba(251, 191, 36, 0.5) 40%, rgba(251, 191, 36, 0.3) 60%, transparent 100%)',
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.6), inset 0 0 15px rgba(251, 191, 36, 0.8), 0 10px 20px rgba(0, 0, 0, 0.5)',
                  animation: 'shadowPulse 1s ease-in-out infinite',
                  zIndex: 1,
                  filter: 'brightness(1.2)',
                }}
              >
                {note.fret && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                      {/* 앞면 */}
                      <div className="relative text-white text-3xl font-black" style={{ 
                        transform: 'translateZ(4px)',
                        textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                        WebkitTextStroke: '0.5px rgba(255,255,255,0.7)',
                        letterSpacing: '-1px',
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: '500'
                      }}>
                        {note.fret}
                      </div>
                      {/* 윗면 */}
                      <div className="absolute top-0 left-0 w-full" style={{ 
                        transform: 'rotateX(-90deg) translateZ(-4px)',
                        transformOrigin: 'top',
                        height: '4px',
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 4px rgba(255,255,255,0.3)'
                      }} />
                      {/* 오른쪽면 */}
                      <div className="absolute top-0 right-0 h-full" style={{ 
                        transform: 'rotateY(90deg) translateZ(8px)',
                        transformOrigin: 'right',
                        width: '4px',
                        background: 'rgba(255,255,255,0.7)',
                        boxShadow: '0 2px 4px rgba(255,255,255,0.3)'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 노트 애니메이션 */}
            {[...currentNotes, ...testNotes].map((note) => {
              const isOnTargetLine = Math.abs(note.position - 25) < 1;
              return (
                <div
                  key={note.id}
                  className="absolute w-10 h-10 rounded-full"
                  style={{
                    top: `${getStringPosition(note.stringNumber - 1)}%`,
                    left: `${note.position}%`,
                    transform: 'translate(-50%, -50%) perspective(1000px) rotateX(20deg) rotateY(10deg)',
                    background: isOnTargetLine 
                      ? 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 1) 0%, rgba(251, 191, 36, 0.9) 20%, rgba(251, 191, 36, 0.7) 40%, rgba(251, 191, 36, 0.4) 60%, transparent 100%)'
                      : `radial-gradient(circle at 30% 30%, ${stringColors[note.stringNumber - 1].replace(')', ', 1)')} 0%, ${stringColors[note.stringNumber - 1].replace(')', ', 0.9)')} 20%, ${stringColors[note.stringNumber - 1].replace(')', ', 0.7)')} 40%, ${stringColors[note.stringNumber - 1].replace(')', ', 0.4)')} 60%, transparent 100%)`,
                    animation: isOnTargetLine 
                      ? 'noteHit 0.3s ease-in-out' 
                      : 'notePulse 1s ease-in-out infinite',
                    boxShadow: isOnTargetLine
                      ? '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.8), 0 10px 20px rgba(0, 0, 0, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3)'
                      : `0 0 15px ${stringColors[note.stringNumber - 1]}, 0 0 30px ${stringColors[note.stringNumber - 1]}, inset 0 0 15px ${stringColors[note.stringNumber - 1]}, 0 10px 20px rgba(0, 0, 0, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3)`,
                    filter: 'brightness(1.2) contrast(1.2)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* 노트의 3D 효과를 위한 추가 요소들 */}
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    transform: 'translateZ(2px)',
                  }} />
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.2) 0%, transparent 70%)',
                    transform: 'translateZ(-2px)',
                  }} />
                  {note.fret && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                        {/* 앞면 */}
                        <div className="relative text-white text-3xl font-black" style={{ 
                          transform: 'translateZ(4px)',
                          textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                          WebkitTextStroke: '0.5px rgba(255,255,255,0.7)',
                          letterSpacing: '-1px',
                          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                          fontFamily: "'Orbitron', sans-serif",
                          fontWeight: '500'
                        }}>
                          {note.fret}
                        </div>
                        {/* 윗면 */}
                        <div className="absolute top-0 left-0 w-full" style={{ 
                          transform: 'rotateX(-90deg) translateZ(-4px)',
                          transformOrigin: 'top',
                          height: '4px',
                          background: 'rgba(255,255,255,0.9)',
                          boxShadow: '0 2px 4px rgba(255,255,255,0.3)'
                        }} />
                        {/* 오른쪽면 */}
                        <div className="absolute top-0 right-0 h-full" style={{ 
                          transform: 'rotateY(90deg) translateZ(8px)',
                          transformOrigin: 'right',
                          width: '4px',
                          background: 'rgba(255,255,255,0.7)',
                          boxShadow: '0 2px 4px rgba(255,255,255,0.3)'
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 수직선 */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px]"
                style={{
                  left: `${12.5 + i * 12.5}%`,
                  height: 'calc(100% - 40px)',
                  background: i === 1 || i === 2
                    ? 'linear-gradient(180deg, rgba(52, 211, 153, 1), rgba(52, 211, 153, 0.8))'
                    : 'linear-gradient(180deg, rgba(251, 191, 36, 0.6), rgba(251, 191, 36, 0.3))',
                  opacity: i === 1 || i === 2 ? 0.9 : 0.6,
                  boxShadow: i === 1 || i === 2
                    ? '0 0 15px rgba(52, 211, 153, 0.7), 0 0 30px rgba(52, 211, 153, 0.4)' 
                    : 'none',
                }}
              />
            ))}

            {/* 바닥 하이라이트 효과 */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(251, 191, 36, 0.15), transparent)',
                opacity: 0.5,
              }}
            />
          </div>

          {/* 확장된 바닥 부분 */}
          <div 
            className="absolute top-[50%] left-0 w-full h-[50%]"
            style={{
              background: 'linear-gradient(to bottom, #2d2d2d, #1a1a1a)',
              opacity: 1,
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>

        {/* 노트 영역 */}
        <div className="absolute inset-0">
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map(renderNote)
          ) : (
            <div className="text-white text-center mt-10">
              노트가 없습니다. 곡을 선택해주세요.
            </div>
          )}
        </div>
      </div>
      {currentChord && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 h-1 bg-purple-500/30" 
               style={{ top: `${getStringPosition(Math.min(...currentChord.strings) - 1)}px` }} />
          <div className="absolute left-0 right-0 h-1 bg-purple-500/30" 
               style={{ top: `${getStringPosition(Math.max(...currentChord.strings) - 1)}px` }} />
        </div>
      )}
      <style>
        {`
          @keyframes noteHit {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full h-screen" style={{ transform: 'translateY(-35%)' }}>
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg z-50 text-white transition-colors"
          >
            <HiArrowsPointingIn className="w-5 h-5" />
          </button>
          {renderTimelineContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-zinc-900 to-black rounded-lg overflow-hidden">
      {/* 테스트 버튼들 */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {/* 코드 선택 드롭다운 */}
        <div className="relative">
          <select
            value={selectedChord}
            onChange={(e) => setSelectedChord(e.target.value)}
            className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="A">A</option>
            <option value="Am">Am</option>
            <option value="B">B</option>
            <option value="Bm">Bm</option>
            <option value="C">C</option>
            <option value="Cm">Cm</option>
            <option value="D">D</option>
            <option value="Dm">Dm</option>
            <option value="E">E</option>
            <option value="Em">Em</option>
            <option value="F">F</option>
            <option value="Fm">Fm</option>
            <option value="G">G</option>
            <option value="Gm">Gm</option>
          </select>
        </div>

        {/* 코드 생성 버튼 */}
        <button
          onClick={() => {
            switch(selectedChord) {
              case 'C': createCChordNote(); break;
              case 'Cm': createCmChordNote(); break;
              case 'D': createDChordNote(); break;
              case 'Dm': createDmChordNote(); break;
              case 'E': createEChordNote(); break;
              case 'Em': createEmChordNote(); break;
              case 'F': createFChordNote(); break;
              case 'Fm': createFmChordNote(); break;
              case 'G': createGChordNote(); break;
              case 'Gm': createGmChordNote(); break;
              case 'A': createAChordNote(); break;
              case 'Am': createAmChordNote(); break;
              case 'B': createBChordNote(); break;
              case 'Bm': createBmChordNote(); break;
            }
          }}
          className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors"
        >
          코드 생성
        </button>

        {/* 배속 드롭다운 */}
        <div className="relative">
          <select
            value={playbackSpeed}
            onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
            className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value={0.2}>0.2x</option>
            <option value={0.4}>0.4x</option>
            <option value={0.6}>0.6x</option>
            <option value={0.8}>0.8x</option>
            <option value={1.0}>1.0x</option>
            <option value={1.2}>1.2x</option>
            <option value={1.4}>1.4x</option>
            <option value={1.6}>1.6x</option>
            <option value={1.8}>1.8x</option>
            <option value={2.0}>2.0x</option>
          </select>
        </div>
      </div>

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg z-10 text-white transition-colors"
      >
        <HiArrowsPointingOut className="w-5 h-5" />
      </button>
      {renderTimelineContent()}
    </div>
  );
};

export default ChordTimeline;
