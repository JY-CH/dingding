import React, { useState, useEffect } from 'react';
import { ChordProgression } from '../../types/guitar';

const SAMPLE_PROGRESSIONS: ChordProgression[] = [
  {
    id: '1',
    name: '기본 팝 프로그레션',
    difficulty: 'beginner',
    chords: ['C', 'G', 'Am', 'F'],
    bpm: 80
  },
  {
    id: '2',
    name: '재즈 2-5-1 프로그레션',
    difficulty: 'intermediate',
    chords: ['Dm7', 'G7', 'Cmaj7'],
    bpm: 120
  },
  // ... 더 많은 프로그레션
];

interface ChordProgressionPracticeProps {
  onChordChange: (chord: string) => void;
}

const ChordProgressionPractice: React.FC<ChordProgressionPracticeProps> = ({ onChordChange }) => {
  const [selectedProgression, setSelectedProgression] = useState<ChordProgression>(SAMPLE_PROGRESSIONS[0]);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentChordIndex((prev) => {
          const nextIndex = (prev + 1) % selectedProgression.chords.length;
          onChordChange(selectedProgression.chords[nextIndex]);
          return nextIndex;
        });
      }, (60 / selectedProgression.bpm) * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, selectedProgression, onChordChange]);

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">코드 프로그레션 연습</h3>

      <div className="space-y-4">
        <select
          value={selectedProgression.id}
          onChange={(e) => {
            const progression = SAMPLE_PROGRESSIONS.find(p => p.id === e.target.value);
            if (progression) {
              setSelectedProgression(progression);
              setCurrentChordIndex(0);
              setIsPlaying(false);
            }
          }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          {SAMPLE_PROGRESSIONS.map((prog) => (
            <option key={prog.id} value={prog.id}>
              {prog.name} ({prog.difficulty})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-4 gap-2">
          {selectedProgression.chords.map((chord, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center ${
                currentChordIndex === index
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/5 text-zinc-400'
              }`}
            >
              {chord}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {isPlaying ? '중지' : '시작'}
          </button>

          <div className="text-sm text-zinc-400">
            BPM: {selectedProgression.bpm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordProgressionPractice; 