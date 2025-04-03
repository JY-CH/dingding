import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isMintAreaActive, setIsMintAreaActive] = useState(false);
  const [shadowNotes, setShadowNotes] = useState<Note[]>([]);

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
  // 예시: 1번줄 0%, 2번줄 15%, 3번줄 30% ...
  // 여기서 각 줄의 위치를 직접 조정할 수 있습니다.
  // 0%는 가장 위쪽, 100%는 가장 아래쪽을 의미합니다.
  // 각 줄의 간격을 원하는 대로 조정하세요.
  const stringPositions = [
    10,    // 1번줄 위치 (최상단)
    25,   // 2번줄 위치
    40,   // 3번줄 위치
    55,   // 4번줄 위치
    70,   // 5번줄 위치
    85,   // 6번줄 위치
  ];

  // 줄 위치 계산 함수
  // 이 함수는 stringPositions 배열에서 해당 줄의 위치를 가져옵니다.
  // index는 0부터 시작하므로, 1번줄은 index 0, 2번줄은 index 1, ... 입니다.
  const getStringPosition = (index: number) => {
    return stringPositions[index];
  };

  // 움직이는 빛 효과를 위한 키프레임 정의
  const shimmerKeyframes = `
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
  `;

  // 테스트용 노트 생성 함수
  const createTestNote = (stringNumber: number) => {
    const newNote: Note = {
      id: Date.now() + Math.random(),
      stringNumber,
      position: 100, // 오른쪽에서 시작
      timing: Date.now(),
      isChord: false,
      chord: '' // 빈 문자열로 초기화
    };
    setTestNotes(prev => [...prev, newNote]);
  };

  // C코드 손모양 노트 생성 함수
  const createCChordNote = () => {
    const cChordNotes = [
      { stringNumber: 2, position: 100, offset: 5 },    // 2번 줄 (가장 앞)
      { stringNumber: 4, position: 100, offset: 0 },    // 4번 줄 (중간)
      { stringNumber: 5, position: 100, offset: -5 }    // 5번 줄 (가장 뒤)
    ];

    const newNotes = cChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'C'
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 C코드 손모양 유지)
    setShadowNotes(cChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'C'
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // A코드 손모양 노트 생성 함수
  const createAChordNote = () => {
    const aChordNotes = [
      { stringNumber: 2, position: 100, offset: 5 },    // 2번 줄 (가장 앞)
      { stringNumber: 3, position: 100, offset: 0 },    // 3번 줄 (중간)
      { stringNumber: 4, position: 100, offset: -5 }    // 4번 줄 (가장 뒤)
    ];

    const newNotes = aChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: note.position + note.offset,
      timing: Date.now(),
      isChord: true,
      chord: 'A'
    }));

    // 노트 생성과 동시에 그림자도 생성 (민트색 세로선 사이 중앙에 A코드 손모양 유지)
    setShadowNotes(aChordNotes.map(note => ({
      id: Date.now() + Math.random(),
      stringNumber: note.stringNumber,
      position: 31.25 + note.offset, // 민트색 세로선 사이 중앙에서 offset 적용
      timing: Date.now(),
      isChord: true,
      chord: 'A'
    })));
    setTestNotes(prev => [...prev, ...newNotes]);
  };

  // 테스트용 노트 이동 함수
  useEffect(() => {
    if (testNotes.length > 0) {
      const interval = setInterval(() => {
        setTestNotes(prevNotes => {
          const newNotes = prevNotes.map(note => ({
            ...note,
            position: note.position - 0.5
          })).filter(note => note.position > -10);

          // C코드나 A코드의 모든 노트가 민트색 바닥 영역(25% ~ 37.5%)을 지나쳤는지 확인
          const chordNotes = newNotes.filter(note => note.chord === 'C' || note.chord === 'A');
          if (chordNotes.length > 0) {
            // 모든 노트가 37.5% 위치를 지나쳤는지 확인
            const allNotesPassed = chordNotes.every(note => note.position <= 37.5);
            if (allNotesPassed) {
              setShadowNotes([]); // 그림자 제거
            }
          }

          return newNotes;
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [testNotes]);

  // 노트가 지나갈 때 해당 줄을 활성화하는 효과
  useEffect(() => {
    if (isPlaying && currentSong && notes && notes.length > 0) {
      console.log('노트 애니메이션 시작');
      // 노트 애니메이션 시작
      const interval = setInterval(() => {
        setCurrentNotes(prevNotes => {
          const newNotes = prevNotes.map(note => ({
            ...note,
            position: note.position - 1  // 2에서 1로 속도 감소
          })).filter(note => note.position > -10); // 화면 밖으로 나간 노트 제거

          // 새로운 노트 추가
          const newNotesToAdd = notes.filter(note => 
            note.timing <= Date.now() && 
            !prevNotes.find(n => n.id === note.id)
          );

          return [...newNotes, ...newNotesToAdd];
        });
      }, 16); // 60fps

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong, notes]);

  const renderNote = (note: Note) => {
    const isChordNote = note.isChord;
    const isCurrentChord = currentChord && note.chordId === currentChord.id;

    return (
      <div
        key={note.id}
        className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${
          isChordNote ? 'bg-purple-500' : 'bg-amber-500'
        } ${isCurrentChord ? 'ring-2 ring-white' : ''}`}
        style={{
          left: `${note.position}%`,
          top: `${getStringPosition(note.stringNumber - 1)}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isPlaying ? 1 : 0.5
        }}
      />
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
                className="absolute w-8 h-8"
                style={{
                  top: `${getStringPosition(note.stringNumber - 1)}%`,
                  left: `${note.position}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.4)',
                  animation: 'shadowPulse 1s ease-in-out infinite',
                  zIndex: 1
                }}
              />
            ))}

            {/* 노트 애니메이션 */}
            {[...currentNotes, ...testNotes].map((note) => {
              const isOnTargetLine = Math.abs(note.position - 25) < 1;
              return (
                <div
                  key={note.id}
                  className="absolute w-8 h-8"
                  style={{
                    top: `${getStringPosition(note.stringNumber - 1)}%`,
                    left: `${note.position}%`,
                    transform: 'translate(-50%, -50%)',
                    background: isOnTargetLine 
                      ? 'radial-gradient(circle, rgba(251, 191, 36, 1) 0%, rgba(251, 191, 36, 0.8) 50%, transparent 70%)'
                      : `radial-gradient(circle, ${stringColors[note.stringNumber - 1]} 0%, transparent 70%)`,
                    animation: isOnTargetLine 
                      ? 'noteHit 0.3s ease-in-out' 
                      : 'notePulse 1s ease-in-out infinite',
                    boxShadow: isOnTargetLine
                      ? '0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(251, 191, 36, 0.5), 0 0 90px rgba(251, 191, 36, 0.3)'
                      : `0 0 20px ${stringColors[note.stringNumber - 1]}`,
                  }}
                />
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
        {[1, 2, 3, 4, 5, 6].map(stringNumber => (
          <button
            key={stringNumber}
            onClick={() => createTestNote(stringNumber)}
            className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors"
          >
            {stringNumber}번 줄
          </button>
        ))}
        <button
          onClick={createCChordNote}
          className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors"
        >
          C코드
        </button>
        <button
          onClick={createAChordNote}
          className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white transition-colors"
        >
          A코드
        </button>
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
