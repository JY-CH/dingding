import React, { useState } from 'react';

// 코드별 프랫보드 포지션 데이터 추가
const CHORD_POSITIONS = {
  C: [
    { string: 2, fret: 1 },
    { string: 4, fret: 2 },
    { string: 5, fret: 3 },
  ],
  G: [
    { string: 5, fret: 2 },
    { string: 6, fret: 3 },
  ],
  D: [
    { string: 3, fret: 2 },
    { string: 1, fret: 3 },
    { string: 2, fret: 2 },
  ],
  Am: [
    { string: 2, fret: 1 },
    { string: 4, fret: 2 },
  ],
  Em: [
    { string: 4, fret: 2 },
    { string: 5, fret: 2 },
  ],
};

interface FretboardProps {
  currentChord?: string;
  onPositionSelect?: (position: { string: number; fret: number }) => void;
}

const Fretboard: React.FC<FretboardProps> = ({ currentChord, onPositionSelect }) => {
  const [hoveredPosition, setHoveredPosition] = useState<{ string: number; fret: number } | null>(
    null,
  );

  const currentPositions = currentChord
    ? CHORD_POSITIONS[currentChord as keyof typeof CHORD_POSITIONS]
    : [];

  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">프랫보드</h3>
        {currentChord && <span className="text-amber-500 font-medium">{currentChord} 코드</span>}
      </div>

      <div className="relative">
        {/* 프랫보드 그리드 */}
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 6 }).map((_, stringIndex) => (
            <div key={stringIndex} className="flex flex-col">
              {Array.from({ length: 5 }).map((_, fretIndex) => {
                const isCurrentPosition = currentPositions.some(
                  (pos) => pos.string === stringIndex + 1 && pos.fret === fretIndex + 1,
                );
                const isHovered =
                  hoveredPosition?.string === stringIndex + 1 &&
                  hoveredPosition?.fret === fretIndex + 1;

                return (
                  <div
                    key={`${stringIndex}-${fretIndex}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors
                      ${
                        isCurrentPosition
                          ? 'bg-amber-500 text-white'
                          : isHovered
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    onMouseEnter={() =>
                      setHoveredPosition({ string: stringIndex + 1, fret: fretIndex + 1 })
                    }
                    onMouseLeave={() => setHoveredPosition(null)}
                    onClick={() =>
                      onPositionSelect?.({ string: stringIndex + 1, fret: fretIndex + 1 })
                    }
                  >
                    {isCurrentPosition && <div className="w-4 h-4 rounded-full bg-white" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 프랫 번호 표시 */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="text-xs text-zinc-400">
              {index + 1}
            </span>
          ))}
        </div>

        {/* 줄 번호 표시 */}
        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="text-xs text-zinc-400">
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      {/* 현재 코드 설명 */}
      {currentChord && (
        <div className="mt-4 text-sm text-zinc-300">
          <p>현재 연습 중인 코드: {currentChord}</p>
          <p className="text-xs text-zinc-400 mt-1">
            위 프랫보드에서 표시된 위치에 손가락을 올려주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default Fretboard;
