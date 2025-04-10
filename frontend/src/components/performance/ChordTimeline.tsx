import React, { useEffect, useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiStop } from 'react-icons/hi2';

import { Song, Note, ChordChange, SongDetailResponse } from '../../types/performance';
import {
  createChordNoteWithTiming,
  createChordNoteWithoutShadow,
  createChordNoteWithTimingWithoutShadow,
  chordData,
} from './chords/ChordUtils';

interface FeedbackMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error';
}

interface ChordTimelineProps {
  isPlaying: boolean;
  currentSong: Song | null;
  notes: Note[];
  currentChord: ChordChange | null;
  onPlayingChange: (playing: boolean) => void;
  onChordChange: (chord: ChordChange | null) => void;
  songDetail: SongDetailResponse | null;
  onSheetIndexChange: (index: number) => void;
}

// 그림자 노트 컴포넌트
const ShadowNote = memo(
  ({ note, getStringPosition }: { note: Note; getStringPosition: (index: number) => number }) => {
    return (
      <div
        key={`shadow-${note.id}`}
        className="absolute w-10 h-10 rounded-full"
        style={{
          top: `${getStringPosition(note.stringNumber - 1)}%`,
          left: `${note.position}%`,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.9) 0%, rgba(251, 191, 36, 0.7) 20%, rgba(251, 191, 36, 0.5) 40%, rgba(251, 191, 36, 0.3) 60%, transparent 100%)',
          boxShadow:
            '0 0 15px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.6), inset 0 0 15px rgba(251, 191, 36, 0.8), 0 10px 20px rgba(0, 0, 0, 0.5)',
          animation: 'shadowFade 0.5s ease-in-out',
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          zIndex: 1,
          filter: 'brightness(1.2)',
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      >
        {note.fret && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div
                className="text-white text-3xl font-black"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '500',
                  textShadow: '0 0 10px rgba(255,255,255,0.5)',
                }}
              >
                {note.fret}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

// 그림자 노트 컬렉션 컴포넌트
const ShadowNotes = memo(
  ({
    notes,
    getStringPosition,
  }: {
    notes: Note[];
    getStringPosition: (index: number) => number;
  }) => {
    return (
      <>
        {notes.length > 0 &&
          notes.map((note) => (
            <ShadowNote
              key={`shadow-${note.id}`}
              note={note}
              getStringPosition={getStringPosition}
            />
          ))}
      </>
    );
  },
);

const ChordTimeline: React.FC<ChordTimelineProps> = ({
  isPlaying,
  currentSong,
  notes = [],
  currentChord: _,
  onPlayingChange,
  onChordChange,
  songDetail,
  onSheetIndexChange,
}) => {
  const [testNotes, setTestNotes] = useState<Note[]>([]);
  const [activeStrings, setActiveStrings] = useState<number[]>([]);
  const [shadowNotes, setShadowNotes] = useState<Note[]>([]);
  const [_currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const [_gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  // const [instrumentVolume, setInstrumentVolume] = useState<number>(0.5);
  const [selectedChord, setSelectedChord] = useState('C');
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
  const requestRef = useRef<number | null>(null);
  const shadowNotesRef = useRef<Note[]>([]);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioStarted, setIsAudioStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const stringColors = [
    'rgba(251, 191, 36, 0.6)', // 1번줄 - amber-400 (가장 얇은 줄)
    'rgba(251, 191, 36, 0.55)', // 2번줄 - amber-400
    'rgba(251, 191, 36, 0.5)', // 3번줄 - amber-400
    'rgba(192, 192, 192, 0.7)', // 4번줄 - silver
    'rgba(192, 192, 192, 0.65)', // 5번줄 - silver
    'rgba(192, 192, 192, 0.6)', // 6번줄 - silver
  ];

  // 각 줄의 두께 설정 (위에서 아래로 갈수록 두꺼워짐)
  const stringThickness = [
    3.5, // 1번줄 (가장 두꺼운 줄)
    3, // 2번줄
    2.5, // 3번줄
    3, // 4번줄
    2.5, // 5번줄
    2, // 6번줄 (가장 얇은 줄)
  ];

  // 각 줄의 위치를 직접 설정 (0% ~ 100% 사이의 값으로 설정)
  // 예시: 6번줄 0%, 5번줄 15%, 4번줄 30% ...
  // 여기서 각 줄의 위치를 직접 조정할 수 있습니다.
  // 0%는 가장 위쪽, 100%는 가장 아래쪽을 의미합니다.
  // 각 줄의 간격을 원하는 대로 조정하세요.
  const stringPositions = [
    85, // 1번줄 위치 (최하단)
    70, // 2번줄 위치
    55, // 3번줄 위치
    40, // 4번줄 위치
    25, // 5번줄 위치
    10, // 6번줄 위치 (최상단)
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

  // C코드 손모양 노트 생성 함수
  const createCChordNote = () => {
    createChordNoteWithoutShadow('C', setTestNotes);
  };

  // A코드 손모양 노트 생성 함수
  const createAChordNote = () => {
    createChordNoteWithoutShadow('A', setTestNotes);
  };

  // Am 코드 손모양 노트 생성 함수
  const createAmChordNote = () => {
    createChordNoteWithoutShadow('Am', setTestNotes);
  };

  // B 코드 손모양 노트 생성 함수
  const createBChordNote = () => {
    createChordNoteWithoutShadow('B', setTestNotes);
  };

  // Bm 코드 손모양 노트 생성 함수
  const createBmChordNote = () => {
    createChordNoteWithoutShadow('Bm', setTestNotes);
  };

  // Cm 코드 손모양 노트 생성 함수
  const createCmChordNote = () => {
    createChordNoteWithoutShadow('Cm', setTestNotes);
  };

  // D 코드 손모양 노트 생성 함수
  const createDChordNote = () => {
    createChordNoteWithoutShadow('D', setTestNotes);
  };

  // Dm 코드 손모양 노트 생성 함수
  const createDmChordNote = () => {
    createChordNoteWithoutShadow('Dm', setTestNotes);
  };

  // E 코드 손모양 노트 생성 함수
  const createEChordNote = () => {
    createChordNoteWithoutShadow('E', setTestNotes);
  };

  // Em 코드 손모양 노트 생성 함수
  const createEmChordNote = () => {
    createChordNoteWithoutShadow('Em', setTestNotes);
  };

  // F 코드 손모양 노트 생성 함수
  const createFChordNote = () => {
    createChordNoteWithoutShadow('F', setTestNotes);
  };

  // Fm 코드 손모양 노트 생성 함수
  const createFmChordNote = () => {
    createChordNoteWithoutShadow('Fm', setTestNotes);
  };

  // G 코드 손모양 노트 생성 함수
  const createGChordNote = () => {
    createChordNoteWithoutShadow('G', setTestNotes);
  };

  // Gm 코드 손모양 노트 생성 함수
  const createGmChordNote = () => {
    createChordNoteWithoutShadow('Gm', setTestNotes);
  };

  // 배속 변경 함수
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  // 테스트용 노트 이동 함수
  useEffect(() => {
    if (testNotes.length > 0) {
      const interval = setInterval(() => {
        setTestNotes((prevNotes) => {
          const newNotes = prevNotes
            .map((note) => ({
              ...note,
              position: note.position - 0.5 * playbackSpeed,
            }))
            .filter((note) => note.position > -10);

          // 노트가 타겟 라인(25%)에 도달했는지 확인하고 해당 줄 활성화
          const passedNotes = prevNotes.filter(
            (note) => note.position > 25 && note.position - 0.5 * playbackSpeed <= 25,
          );

          if (passedNotes.length > 0) {
            const stringNumbers = passedNotes.map((note) => note.stringNumber);
            setActiveStrings(stringNumbers);

            setTimeout(() => {
              setActiveStrings([]);
            }, 500);
          }

          return newNotes;
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [testNotes, playbackSpeed]);

  // shadowNotes 상태가 변경될 때마다 ref 업데이트
  useEffect(() => {
    shadowNotesRef.current = shadowNotes;
  }, [shadowNotes]);

  // 그림자 노트 효과 처리
  useEffect(() => {
    if (testNotes.length === 0) {
      setShadowNotes([]);
      return;
    }

    // 민트색 세로선 위치
    const PASSED_POSITION = 20;

    // 그림자 노트 생성 함수
    const updateShadowNotes = () => {
      // 코드별로 노트 그룹화
      const chordGroups: { [key: string]: Note[] } = {};
      testNotes.forEach((note) => {
        if (!note.chord) return;
        if (!chordGroups[note.chord]) {
          chordGroups[note.chord] = [];
        }
        chordGroups[note.chord].push(note);
      });

      // 코드별 위치 정보 계산
      const chordPositions: Array<{ chord: string; min: number; max: number }> = [];
      Object.entries(chordGroups).forEach(([chord, notes]) => {
        const positions = notes.map((note) => note.position);
        if (positions.length > 0) {
          chordPositions.push({
            chord,
            min: Math.min(...positions),
            max: Math.max(...positions),
          });
        }
      });

      // 위치 기준 정렬 (오른쪽에서 왼쪽으로)
      chordPositions.sort((a, b) => b.min - a.min);

      // 화면에 보이는 코드만 필터링
      const visibleChords = chordPositions.filter((c) => c.min > -10);

      if (visibleChords.length === 0) {
        setShadowNotes([]);
        return;
      }

      // 기준 ID (1초마다 변경)
      const baseId = Math.floor(Date.now() / 1000) * 1000;

      // 첫 번째 코드가 민트색 세로선을 완전히 지나갔는지 확인
      const firstChord = visibleChords[0];
      const isPastMintLine = firstChord.max <= PASSED_POSITION;

      // 코드가 완전히 지나가고 다음 코드가 있는 경우
      if (isPastMintLine && visibleChords.length > 1) {
        // 다음 코드의 그림자 노트 생성
        const nextChord = visibleChords[1].chord;
        const nextChordData = chordData[nextChord];

        if (nextChordData) {
          const shadowNotes = nextChordData.map((note, index) => ({
            id: baseId + index,
            stringNumber: note.stringNumber,
            position: 30 + note.offset * 0.7,
            timing: Date.now(),
            isChord: true,
            chord: nextChord,
            fret: note.fret,
          }));

          setShadowNotes(shadowNotes);
        }
      } else {
        // 현재 코드 그림자 노트 생성
        const currentChord = firstChord.chord;
        const currentChordData = chordData[currentChord];

        if (currentChordData) {
          const shadowNotes = currentChordData.map((note, index) => ({
            id: baseId + index,
            stringNumber: note.stringNumber,
            position: 30 + note.offset * 0.7,
            timing: Date.now(),
            isChord: true,
            chord: currentChord,
            fret: note.fret,
          }));

          setShadowNotes(shadowNotes);
        }
      }
    };

    // 초기 업데이트
    updateShadowNotes();

    // 빠른 업데이트 간격 (16ms = 약 60fps)
    const interval = setInterval(updateShadowNotes, 16);

    return () => {
      clearInterval(interval);
      setShadowNotes([]);
    };
  }, [testNotes]);

  // 실제 연주 노트 이동 효과 제거
  useEffect(() => {
    if (isPlaying && currentSong) {
      console.log('노트 애니메이션 시작');
      const interval = setInterval(() => {
        // 빈 로직으로 대체 (나중에 필요한 기능 추가 가능)
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong, playbackSpeed]);

  // 피드백 메시지 추가 함수
  const addFeedback = (message: string, type: 'success' | 'warning' | 'error') => {
    const newFeedback: FeedbackMessage = {
      id: Date.now(),
      message,
      type,
    };

    // 이전 피드백과 중복되지 않도록 체크
    setFeedbacks((prev) => {
      const isDuplicate = prev.some((f) => f.message === message);
      if (isDuplicate) return prev;
      return [...prev, newFeedback];
    });

    // 3초 후 자동으로 제거
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== newFeedback.id));
    }, 3000);
  };

  // 테스트용 피드백 메시지들
  const testFeedbacks = [
    { message: '완벽한 타이밍이에요! 👏', type: 'success' },
    { message: '코드 전환이 매끄러워요!', type: 'success' },
    { message: '템포가 조금 빨라졌어요', type: 'warning' },
    { message: '코드 모양을 더 정확하게 잡아보세요', type: 'warning' },
    { message: '틀린 코드예요! 다시 한번 확인해주세요', type: 'error' },
  ];

  // 피드백 메시지 렌더링 컴포넌트
  const FeedbackNotifications = () => (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="space-y-2 min-w-[300px] pointer-events-none">
        <AnimatePresence initial={false}>
          {feedbacks.map((feedback) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              style={{
                animation:
                  feedback.type === 'success'
                    ? 'successPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    : feedback.type === 'warning'
                      ? 'warningPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      : 'errorPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
              className={`
                pointer-events-auto
                px-4 py-3 rounded-lg
                shadow-lg backdrop-blur-sm
                flex items-center justify-center gap-3
                ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : feedback.type === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }
              `}
            >
              <div
                className={`
                  w-2 h-2 rounded-full
                  ${
                    feedback.type === 'success'
                      ? 'bg-emerald-400'
                      : feedback.type === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                  }
                `}
              />
              <span className="text-sm font-medium select-none">{feedback.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderNote = (note: Note) => {
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
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 70%)',
            transform: 'translateZ(2px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.2) 0%, transparent 70%)',
            transform: 'translateZ(-2px)',
          }}
        />
        {note.fret && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* 앞면 */}
              <div
                className="relative text-white text-3xl font-black"
                style={{
                  transform: 'translateZ(4px)',
                  textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                  WebkitTextStroke: '0.5px rgba(255,255,255,0.7)',
                  letterSpacing: '-1px',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '500',
                }}
              >
                {note.fret}
              </div>
              {/* 윗면 */}
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: 'rotateX(-90deg) translateZ(-4px)',
                  transformOrigin: 'top',
                  height: '4px',
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(255,255,255,0.3)',
                }}
              />
              {/* 오른쪽면 */}
              <div
                className="absolute top-0 right-0 h-full"
                style={{
                  transform: 'rotateY(90deg) translateZ(8px)',
                  transformOrigin: 'right',
                  width: '4px',
                  background: 'rgba(255,255,255,0.7)',
                  boxShadow: '0 2px 4px rgba(255,255,255,0.3)',
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
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
          
          @keyframes shadowFade {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
      <div
        className="absolute inset-0"
        style={{
          perspective: '2000px',
          perspectiveOrigin: '50% 30%',
        }}
      >
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
                background:
                  i === 1 || i === 2
                    ? 'linear-gradient(180deg, rgba(52, 211, 153, 1), rgba(52, 211, 153, 0.8))'
                    : 'linear-gradient(180deg, transparent, rgba(251, 191, 36, 0.8))',
                opacity: i === 1 || i === 2 ? 0.9 : 0.6,
                boxShadow:
                  i === 1 || i === 2
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
                  background:
                    i === 2
                      ? 'linear-gradient(to bottom, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.05))'
                      : i % 2 === 0
                        ? 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)'
                        : 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
                  boxShadow:
                    i === 2
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
                  background:
                    i < 3
                      ? `repeating-linear-gradient(90deg, 
                        ${color} 0px, 
                        ${color} ${stringThickness[i] / 2}px, 
                        rgba(251, 191, 36, 0.75) ${stringThickness[i] / 2}px, 
                        rgba(251, 191, 36, 0.75) ${stringThickness[i]}px
                      )`
                      : color,
                  backgroundSize: i < 3 ? `${stringThickness[i]}px 100%` : 'auto',
                  animation: activeStrings.includes(i + 1) ? 'pulse 0.5s ease-in-out' : 'none',
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
            <ShadowNotes notes={shadowNotes} getStringPosition={getStringPosition} />

            {/* 노트 애니메이션 */}
            {[...testNotes].map((note) => {
              const isOnTargetLine = Math.abs(note.position - 25) < 1;
              return (
                <div
                  key={note.id}
                  className="absolute w-10 h-10 rounded-full"
                  style={{
                    top: `${getStringPosition(note.stringNumber - 1)}%`,
                    left: `${note.position}%`,
                    transform:
                      'translate(-50%, -50%) perspective(1000px) rotateX(20deg) rotateY(10deg)',
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
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                      transform: 'translateZ(2px)',
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.2) 0%, transparent 70%)',
                      transform: 'translateZ(-2px)',
                    }}
                  />
                  {note.fret && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                        {/* 앞면 */}
                        <div
                          className="relative text-white text-3xl font-black"
                          style={{
                            transform: 'translateZ(4px)',
                            textShadow:
                              '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                            WebkitTextStroke: '0.5px rgba(255,255,255,0.7)',
                            letterSpacing: '-1px',
                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: '500',
                          }}
                        >
                          {note.fret}
                        </div>
                        {/* 윗면 */}
                        <div
                          className="absolute top-0 left-0 w-full"
                          style={{
                            transform: 'rotateX(-90deg) translateZ(-4px)',
                            transformOrigin: 'top',
                            height: '4px',
                            background: 'rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 4px rgba(255,255,255,0.3)',
                          }}
                        />
                        {/* 오른쪽면 */}
                        <div
                          className="absolute top-0 right-0 h-full"
                          style={{
                            transform: 'rotateY(90deg) translateZ(8px)',
                            transformOrigin: 'right',
                            width: '4px',
                            background: 'rgba(255,255,255,0.7)',
                            boxShadow: '0 2px 4px rgba(255,255,255,0.3)',
                          }}
                        />
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
                  background:
                    i === 1 || i === 2
                      ? 'linear-gradient(180deg, rgba(52, 211, 153, 1), rgba(52, 211, 153, 0.8))'
                      : 'linear-gradient(180deg, rgba(251, 191, 36, 0.6), rgba(251, 191, 36, 0.3))',
                  opacity: i === 1 || i === 2 ? 0.9 : 0.6,
                  boxShadow:
                    i === 1 || i === 2
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
            <div className="text-white text-center mt-10"></div>
          )}
        </div>
      </div>
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

  // 연주 시작/종료 처리 함수
  const handlePlayToggle = async () => {
    if (!currentSong) {
      addFeedback('연주할 곡을 선택해주세요', 'warning');
      return;
    }

    if (!isPlaying) {
      try {
        // 시작 전 모든 상태 초기화
        await handleStop();

        // 연주 시작
        startTimeRef.current = Date.now();
        setTestNotes([]); // 노트 초기화
        setShadowNotes([]); // 그림자 노트 초기화
        setCurrentSheetIndex(0); // 악보 인덱스 초기화
        onSheetIndexChange(0); // 부모 컴포넌트 악보 인덱스 업데이트
        setGameStartTime(Date.now()); // 게임 시작 시간 설정

        // 4초 후 오디오 재생 시작
        setTimeout(() => {
          if (audioRef.current && !isAudioStarted) {
            audioRef.current.currentTime = 0;
            audioRef.current.playbackRate = playbackSpeed;
            audioRef.current.play().catch((error) => {
              console.error('오디오 재생 실패:', error);
              addFeedback('오디오 재생에 실패했습니다', 'error');
              handleStop();
              return;
            });
            setIsAudioStarted(true); // 오디오가 시작되었음을 표시
          }
        }, 4000);

        onPlayingChange(true);
        addFeedback('연주를 시작합니다', 'success');
      } catch (error) {
        console.error('연주 시작 실패:', error);
        handleStop();
      }
    } else {
      handleStop();
    }
  };

  // 연주 종료 처리 함수
  const handleStop = async () => {
    try {
      // 애니메이션 프레임 정리
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }

      // 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // 상태 초기화
      setTestNotes([]); // 노트 초기화
      setShadowNotes([]); // 그림자 노트 초기화
      setCurrentSheetIndex(0); // 악보 인덱스 초기화
      onSheetIndexChange(0); // 부모 컴포넌트 악보 인덱스 업데이트
      setGameStartTime(null); // 게임 시작 시간 초기화
      setCurrentTime(0); // 현재 시간 초기화

      // 진행 중인 타이머나 인터벌 정리
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      onPlayingChange(false);

      // 실제 연주가 시작된 적이 있을 때만 종료 메시지 표시
      if (startTimeRef.current !== 0) {
        addFeedback('연주를 종료했습니다', 'warning');
      }
      startTimeRef.current = 0;
    } catch (error) {
      console.error('연주 종료 중 오류 발생:', error);
      addFeedback('연주 종료 중 오류가 발생했습니다', 'error');
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  // 오디오 재생 속도 변경 시 처리
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // 오디오 종료 시 처리
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        handleStop();
      };
    }
  }, []);

  // 연주 상태 변경 감지 및 처리
  useEffect(() => {
    if (!isPlaying && startTimeRef.current !== 0) {
      handleStop();
    }
  }, [isPlaying]);

  // 노트 생성 및 게임 로직
  useEffect(() => {
    if (!isPlaying || !songDetail) return;

    let timeoutIds: NodeJS.Timeout[] = [];
    let isActive = true;

    const cleanup = () => {
      isActive = false;
      timeoutIds.forEach(clearTimeout);
      timeoutIds = [];
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };

    // 게임 시작 시간 설정
    const startTime = Date.now();
    setGameStartTime(startTime);

    console.log('===== 노트 생성 시작 =====');

    // 코드와 순서를 관리하기 위한 변수
    let currentIndex = 0;
    const chordCount = songDetail.sheetMusicResponseDtos.length;
    const allChords = [...songDetail.sheetMusicResponseDtos].sort(
      (a, b) => a.sheetOrder - b.sheetOrder,
    );

    const INTERVAL_SECONDS = 3;

    const createNextChord = () => {
      if (!isActive) return;
      if (currentIndex < chordCount) {
        const chord = allChords[currentIndex];

        console.log(
          `코드 생성: ${chord.chord}, 순서: ${chord.sheetOrder}, 순차적 출력 ${currentIndex + 1}/${chordCount}`,
        );

        switch (chord.chord) {
          case 'Am':
            createAmChordNoteWithTiming(chord.sheetOrder);
            break;
          case 'C':
            createCChordNoteWithTiming(chord.sheetOrder);
            break;
          case 'D':
            createDChordNoteWithTiming(chord.sheetOrder);
            break;
          case 'Em':
            createEmChordNoteWithTiming(chord.sheetOrder);
            break;
          case 'G':
            createGChordNoteWithTiming(chord.sheetOrder);
            break;
          default:
            console.warn(`지원되지 않는 코드: ${chord.chord}`);
            createChordNoteWithTiming(chord.chord, chord.sheetOrder, setTestNotes, setShadowNotes);
        }

        if (isActive) {
          setCurrentSheetIndex(chord.sheetOrder);
          onSheetIndexChange(chord.sheetOrder);

          if (onChordChange) {
            onChordChange(null);
          }

          currentIndex++;

          if (currentIndex < chordCount && isPlaying) {
            const timeoutId = setTimeout(createNextChord, INTERVAL_SECONDS * 1000);
            timeoutIds.push(timeoutId);
          }
        }
      }
    };

    const initialDelay = setTimeout(() => {
      if (isActive) {
        createNextChord();
      }
    }, 2000);
    timeoutIds.push(initialDelay);

    const updateTime = () => {
      if (!isActive) return;

      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      setCurrentTime(elapsedTime);

      if (isPlaying && isActive) {
        requestRef.current = requestAnimationFrame(updateTime);
      }
    };

    requestRef.current = requestAnimationFrame(updateTime);

    return cleanup;
  }, [isPlaying, songDetail, onSheetIndexChange, onChordChange]);

  // 타이밍 정보를 포함한 코드 생성 함수 예시 (Am)
  const createAmChordNoteWithTiming = (sheetOrder: number) => {
    createChordNoteWithTimingWithoutShadow('Am', sheetOrder, setTestNotes);
  };

  // 다른 코드들도 같은 방식으로 수정
  const createCChordNoteWithTiming = (sheetOrder: number) => {
    createChordNoteWithTimingWithoutShadow('C', sheetOrder, setTestNotes);
  };

  const createDChordNoteWithTiming = (sheetOrder: number) => {
    createChordNoteWithTimingWithoutShadow('D', sheetOrder, setTestNotes);
  };

  const createEmChordNoteWithTiming = (sheetOrder: number) => {
    createChordNoteWithTimingWithoutShadow('Em', sheetOrder, setTestNotes);
  };

  const createGChordNoteWithTiming = (sheetOrder: number) => {
    createChordNoteWithTimingWithoutShadow('G', sheetOrder, setTestNotes);
  };

  // 음소거 버튼 클릭 핸들러
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 컴포넌트 반환
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-zinc-900 to-black rounded-lg overflow-hidden">
      <style>
        {`
          @keyframes successPulse {
            0%, 100% { background-color: rgba(16, 185, 129, 0.1); }
            50% { background-color: rgba(16, 185, 129, 0.2); }
          }
          @keyframes warningPulse {
            0%, 100% { background-color: rgba(245, 158, 11, 0.1); }
            50% { background-color: rgba(245, 158, 11, 0.2); }
          }
          @keyframes errorPulse {
            0%, 100% { background-color: rgba(239, 68, 68, 0.1); }
            50% { background-color: rgba(239, 68, 68, 0.2); }
          }
        `}
      </style>
      <FeedbackNotifications />

      {/* 음소거 버튼 */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={toggleMute}
          className={`px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors`}
        >
          {isMuted ? '음소거 해제' : '음소거'}
        </button>
      </div>

      {/* 테스트 버튼들 - 숨김 처리 */}
      <div className="hidden absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        {/* 피드백 테스트 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={() => addFeedback(testFeedbacks[0].message, 'success')}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors text-sm font-medium"
          >
            성공
          </button>
          <button
            onClick={() => addFeedback(testFeedbacks[2].message, 'warning')}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors text-sm font-medium"
          >
            경고
          </button>
          <button
            onClick={() => addFeedback(testFeedbacks[4].message, 'error')}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors text-sm font-medium"
          >
            에러
          </button>
        </div>

        {/* 기존 컨트롤들 */}
        <div className="flex gap-2">
          {/* 기존 드롭다운들 */}
          <div className="relative">
            <select
              value={selectedChord}
              onChange={(e) => setSelectedChord(e.target.value)}
              className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
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

          {/* 기존 버튼들 */}
          <button
            onClick={() => {
              switch (selectedChord) {
                case 'C':
                  createCChordNote();
                  break;
                case 'Cm':
                  createCmChordNote();
                  break;
                case 'D':
                  createDChordNote();
                  break;
                case 'Dm':
                  createDmChordNote();
                  break;
                case 'E':
                  createEChordNote();
                  break;
                case 'Em':
                  createEmChordNote();
                  break;
                case 'F':
                  createFChordNote();
                  break;
                case 'Fm':
                  createFmChordNote();
                  break;
                case 'G':
                  createGChordNote();
                  break;
                case 'Gm':
                  createGmChordNote();
                  break;
                case 'A':
                  createAChordNote();
                  break;
                case 'Am':
                  createAmChordNote();
                  break;
                case 'B':
                  createBChordNote();
                  break;
                case 'Bm':
                  createBmChordNote();
                  break;
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
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
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
      </div>

      {/* 시작/종료 버튼 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <motion.button
          onClick={handlePlayToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!currentSong}
          className={`
            px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm
            transition-colors duration-200
            ${
              !currentSong
                ? 'bg-zinc-500/10 text-zinc-400 cursor-not-allowed'
                : isPlaying
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
            }
          `}
        >
          {isPlaying ? (
            <>
              <HiStop className="w-4 h-4" />
              <span>정지</span>
            </>
          ) : (
            <>
              <HiPlay className="w-4 h-4" />
              <span>시작</span>
            </>
          )}
        </motion.button>
      </div>

      {renderTimelineContent()}

      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.songVoiceFileUrl}
          onEnded={() => {
            onPlayingChange(false);
            setCurrentTime(0);
          }}
        />
      )}
    </div>
  );
};

export default ChordTimeline;
