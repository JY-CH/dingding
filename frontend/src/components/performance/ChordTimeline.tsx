import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChordNote } from '../../types/performance';

interface ChordTimelineProps {
  chordNotes: ChordNote[];
  isPlaying: boolean;
}

const ChordTimeline: React.FC<ChordTimelineProps> = ({ chordNotes, isPlaying }) => {
  return (
    <div className="bg-zinc-800 rounded-xl p-6">
      <div className="relative h-64 overflow-hidden">
        {/* 타임라인 배경 */}
        <div className="absolute inset-0 grid grid-rows-4 gap-4">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="h-full border-b-2 border-zinc-700/50"
            />
          ))}
        </div>

        {/* 코드 노트들 */}
        <AnimatePresence>
          {chordNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ x: '100%' }}
              animate={{
                x: '-100%',
                transition: {
                  duration: 8,
                  ease: 'linear',
                  paused: !isPlaying
                },
              }}
              exit={{ x: '-110%' }}
              style={{
                position: 'absolute',
                top: `${(note.position - 1) * 25}%`,
                height: '20%',
              }}
              className="flex items-center"
            >
              <div className="px-6 py-2 bg-amber-500 rounded-lg text-white font-medium">
                {note.chord}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 현재 위치 표시선 */}
        <div className="absolute left-1/4 top-0 h-full w-px bg-amber-500">
          <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500" />
          <div className="absolute -bottom-1 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500" />
        </div>
      </div>
    </div>
  );
};

export default ChordTimeline; 