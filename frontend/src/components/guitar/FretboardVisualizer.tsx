import React from 'react';
import { GuitarString } from '../../types/guitar';

interface FretboardVisualizerProps {
  strings: GuitarString[];
  frets: number;
  activeNotes?: string[];
  currentChord?: {
    name: string;
    fingering: number[];
  };
}

const FretboardVisualizer: React.FC<FretboardVisualizerProps> = ({
  strings,
  frets,
  activeNotes = [],
  currentChord,
}) => {
  const chordFingerings: Record<string, number[]> = {
    A: [-1, 0, 2, 2, 2, 0],
    B: [-1, 2, 4, 4, 4, 2],
    C: [-1, 3, 2, 0, 1, 0],
    D: [-1, -1, 0, 2, 3, 2],
    E: [0, 2, 2, 1, 0, 0],
    F: [1, 1, 2, 3, 3, 1],
    G: [3, 2, 0, 0, 0, 3],
  };

  const getFingering = (stringIndex: number) => {
    if (!currentChord?.name) return null;
    const fingering = chordFingerings[currentChord.name];
    return fingering ? fingering[stringIndex] : null;
  };

  const visibleFrets = 5;

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
          {strings.map((string, stringIndex) => (
            <div
              key={`${string.note}-${string.octave}-${stringIndex}`}
              className="flex items-center"
            >
              <div className="w-6 text-zinc-400 text-xs font-medium text-center">{string.note}</div>
              <div className="flex-1 relative">
                <div className="h-0.5 bg-zinc-400" />
                <div className="flex absolute top-0 left-0 w-full">
                  {Array.from({ length: visibleFrets + 1 }).map((_, fretIndex) => {
                    const fingering = getFingering(stringIndex);
                    const isActive = activeNotes.includes(string.note);
                    const isFingered = fingering === fretIndex;
                    const isMuted = fingering === -1;

                    return (
                      <div
                        key={fretIndex}
                        className={`w-10 h-0.5 relative ${isActive ? 'bg-amber-500/20' : ''}`}
                      >
                        <div className="absolute top-0 left-0 w-px h-full bg-zinc-500" />
                        {isFingered && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {fretIndex + 1}
                          </div>
                        )}
                        {isMuted && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-red-400 text-sm font-bold">
                            X
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FretboardVisualizer;
