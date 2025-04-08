import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PracticeSelectionProps {
  onStart: (selectedChords: string[], duration: number) => void;
}

const PracticeSelection: React.FC<PracticeSelectionProps> = ({ onStart }) => {
  const [selectedChords, setSelectedChords] = useState<string[]>([]);
  const [duration, setDuration] = useState(30); // 기본 30초

  const allChords = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
    'Cm',
    'C#m',
    'Dm',
    'D#m',
    'Em',
    'Fm',
    'F#m',
    'Gm',
    'G#m',
    'Am',
    'A#m',
    'Bm',
  ];

  const toggleChord = (chord: string) => {
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord],
    );
  };

  const handleStart = () => {
    if (selectedChords.length === 0) {
      alert('최소 하나 이상의 코드를 선택해주세요!');
      return;
    }
    onStart(selectedChords, duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">연습 세션 설정</h2>

      {/* 코드 선택 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-amber-500 mb-4">연습할 코드 선택</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {allChords.map((chord) => (
            <button
              key={chord}
              onClick={() => toggleChord(chord)}
              className={`p-2 rounded-lg transition-colors ${
                selectedChords.includes(chord)
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/10 text-zinc-400 hover:bg-white/20'
              }`}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>

      {/* 연습 시간 선택 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-amber-500 mb-4">연습 시간 선택</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="10"
            max="120"
            step="10"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white font-medium min-w-[4rem]">{duration}초</span>
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={handleStart}
        disabled={selectedChords.length === 0}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          selectedChords.length === 0
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        연습 시작
      </button>
    </motion.div>
  );
};

export default PracticeSelection;
