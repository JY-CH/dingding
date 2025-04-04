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
  const [activeStrings, ] = useState<number[]>([]);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);

  const [shadowNotes, setShadowNotes] = useState<Note[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

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
  }, [testNotes, playbackSpeed]);

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
          top: `${getStringPosition(note.stringNumber - 1)}%`,
          transform: 'translate(-50%, -50%)',
          opacity: isPlaying ? 1 : 0.5
        }}
      >
        {note.fret && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* 앞면 */}
              <div className="relative text-yellow-400 text-4xl font-black" style={{ 
                transform: 'translateZ(4px)',
                textShadow: '3px 3px 6px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.5)',
                WebkitTextStroke: '2px rgba(0,0,0,0.7)',
                letterSpacing: '-1px',
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
              }}>
                {note.fret}
              </div>
              {/* 윗면 */}
              <div className="absolute top-0 left-0 w-full" style={{ 
                transform: 'rotateX(-90deg) translateZ(-4px)',
                transformOrigin: 'top',
                height: '6px',
                background: 'rgba(251, 191, 36, 0.95)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
              }} />
              {/* 오른쪽면 */}
              <div className="absolute top-0 right-0 h-full" style={{ 
                transform: 'rotateY(90deg) translateZ(8px)',
                transformOrigin: 'right',
                width: '6px',
                background: 'rgba(251, 191, 36, 0.85)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
              }} />
            </div>
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
                      <div className="relative text-yellow-400 text-4xl font-black" style={{ 
                        transform: 'translateZ(4px)',
                        textShadow: '3px 3px 6px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.5)',
                        WebkitTextStroke: '2px rgba(0,0,0,0.7)',
                        letterSpacing: '-1px',
                        filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
                      }}>
                        {note.fret}
                      </div>
                      {/* 윗면 */}
                      <div className="absolute top-0 left-0 w-full" style={{ 
                        transform: 'rotateX(-90deg) translateZ(-4px)',
                        transformOrigin: 'top',
                        height: '6px',
                        background: 'rgba(251, 191, 36, 0.95)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
                      }} />
                      {/* 오른쪽면 */}
                      <div className="absolute top-0 right-0 h-full" style={{ 
                        transform: 'rotateY(90deg) translateZ(8px)',
                        transformOrigin: 'right',
                        width: '6px',
                        background: 'rgba(251, 191, 36, 0.85)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
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
                        <div className="relative text-yellow-400 text-4xl font-black" style={{ 
                          transform: 'translateZ(4px)',
                          textShadow: '3px 3px 6px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.5)',
                          WebkitTextStroke: '2px rgba(0,0,0,0.7)',
                          letterSpacing: '-1px',
                          filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
                        }}>
                          {note.fret}
                        </div>
                        {/* 윗면 */}
                        <div className="absolute top-0 left-0 w-full" style={{ 
                          transform: 'rotateX(-90deg) translateZ(-4px)',
                          transformOrigin: 'top',
                          height: '6px',
                          background: 'rgba(251, 191, 36, 0.95)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
                        }} />
                        {/* 오른쪽면 */}
                        <div className="absolute top-0 right-0 h-full" style={{ 
                          transform: 'rotateY(90deg) translateZ(8px)',
                          transformOrigin: 'right',
                          width: '6px',
                          background: 'rgba(251, 191, 36, 0.85)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
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
