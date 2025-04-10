import React from 'react';
import { GuitarString } from '../../types/guitar';

interface FretboardVisualizerProps {
  strings: GuitarString[];
  frets: number;
  activeNotes?: string[];
  currentChord?: {
    name: string;
  };
}

const FretboardVisualizer: React.FC<FretboardVisualizerProps> = ({
  strings,
  currentChord,
}) => {
  const chordFingerings: Record<string, { fingering: number[]; fingers: number[] }> = {
    A: {
      fingering: [0, 0, 2, 2, 2, -1],
      fingers: [0, 0, 1, 2, 3, 0],
    },
    B: {
      fingering: [0, 2, 4, 4, 4, 2],
      fingers: [0, 1, 2, 3, 4, 1],
    },
    C: {
      fingering: [0, 3, 2, 0, 1, -1],
      fingers: [0, 3, 2, 0, 1, 0],
    },
    D: {
      fingering: [0, 0, 0, 2, 3, 2],
      fingers: [0, 0, 0, 2, 3, 1],
    },
    E: {
      fingering: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
    },
    F: {
      fingering: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
    },
    G: {
      fingering: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 4],
    },
  };

  const visibleFrets = 5;

  const getFingering = (stringIndex: number): number | null => {
    if (!currentChord?.name) return null;
    return chordFingerings[currentChord.name]?.fingering[stringIndex] ?? null;
  };

  const getFingerLabel = (stringIndex: number): string | null => {
    if (!currentChord?.name) return null;
    const fingerNum = chordFingerings[currentChord.name]?.fingers[stringIndex];
    return fingerNum && fingerNum > 0 ? fingerNum.toString() : null;
  };

  return (
    <div className="relative w-full bg-zinc-800 rounded-lg p-3">
      {currentChord && (
        <div className="absolute top-1 left-1 bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-medium">
          {currentChord.name}
        </div>
      )}

      <div className="w-full">
        <div className="flex ml-6 mb-3">
          {Array.from({ length: visibleFrets + 1 }).map((_, index) => (
            <div key={`fret-number-${index}`} className="w-10 text-center text-zinc-400 text-xs">
              {index}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {[...strings].reverse().map((string, stringIndex) => {
            const reversedIndex = strings.length - 1 - stringIndex;

            return (
              <div
                key={`${string.note}-${string.octave}-${stringIndex}`}
                className="flex items-center"
              >
                <div className="w-6 text-zinc-400 text-xs font-medium text-center">
                  {string.note}
                </div>
                <div className="flex-1 relative">
                  <div className="h-0.5 bg-zinc-400" />
                  <div className="flex absolute top-0 left-0 w-full">
                    {Array.from({ length: visibleFrets + 1 }).map((_, fretIndex) => {
                      const fingering = getFingering(reversedIndex);
                      const fingerLabel = getFingerLabel(reversedIndex);
                      const isFingered = fingering === fretIndex;

                      return (
                        <div key={fretIndex} className="w-10 h-0.5 relative">
                          <div className="absolute top-0 left-0 w-px h-full bg-zinc-500" />
                          {isFingered && fingerLabel && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                              {fingerLabel}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FretboardVisualizer;
