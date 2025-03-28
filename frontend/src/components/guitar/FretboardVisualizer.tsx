import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { GuitarString } from '../../types/guitar';

interface FretboardVisualizerProps {
  strings: GuitarString[];
  frets: number;
  activeNotes: string[];
}

const FretboardVisualizer: React.FC<FretboardVisualizerProps> = ({
  strings,
  frets = 12,
  activeNotes,
}) => {
  const stringSpacing = 30;
  const fretSpacing = 60;

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        width={fretSpacing * (frets + 1)}
        height={stringSpacing * (strings.length + 1)}
        className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg"
      >
        {/* 프렛 */}
        {Array.from({ length: frets + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={i * fretSpacing}
            y1={stringSpacing}
            x2={i * fretSpacing}
            y2={strings.length * stringSpacing}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={i === 0 ? 4 : 2}
          />
        ))}

        {/* 줄 */}
        {strings.map((string, i) => (
          <React.Fragment key={`string-${i}`}>
            <line
              x1={0}
              y1={(i + 1) * stringSpacing}
              x2={frets * fretSpacing}
              y2={(i + 1) * stringSpacing}
              stroke={string.isPlaying ? '#f59e0b' : 'rgba(255,255,255,0.4)'}
              strokeWidth={6 - i}
            />

            {/* 진동 애니메이션 */}
            {string.isPlaying && (
              <motion.path
                d={`M 0 ${(i + 1) * stringSpacing} Q ${fretSpacing / 2} ${
                  (i + 1) * stringSpacing + Math.sin(Date.now() / 100) * 10
                } ${fretSpacing} ${(i + 1) * stringSpacing}`}
                stroke="#f59e0b"
                strokeWidth={6 - i}
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </React.Fragment>
        ))}

        {/* 프렛 마커 */}
        {[3, 5, 7, 9, 12].map((fret) => (
          <circle
            key={`marker-${fret}`}
            cx={fret * fretSpacing - fretSpacing / 2}
            cy={(strings.length * stringSpacing) / 2}
            r={4}
            fill="rgba(255,255,255,0.3)"
          />
        ))}

        {/* 활성화된 노트 */}
        <AnimatePresence>
          {activeNotes.map((note, i) => (
            <motion.circle
              key={`note-${i}`}
              cx={i * fretSpacing + fretSpacing / 2}
              cy={strings.findIndex((s) => s.note === note) * stringSpacing + stringSpacing}
              r={12}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              fill="#f59e0b"
              className="drop-shadow-lg"
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default FretboardVisualizer;
