import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PracticeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseSelect: (chords: string[], duration: number, repeatCount: number, bpm: number) => void;
  currentExercise?: {
    chords: string[];
    duration: number;
    repeatCount: number;
    bpm: number;
  };
}

const PracticeSelection: React.FC<PracticeSelectionProps> = ({
  isOpen,
  onClose,
  onExerciseSelect,
  currentExercise,
}) => {
  const [selectedChords, setSelectedChords] = useState<string[]>(
    currentExercise?.chords || ['C', 'G', 'F'],
  );
  const [duration, setDuration] = useState(currentExercise?.duration || 30);
  const [repeatCount, setRepeatCount] = useState(currentExercise?.repeatCount || 3);
  const [bpm, setBpm] = useState(currentExercise?.bpm || 60);

  const majorChords = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const minorChords = ['Am', 'Bm', 'Cm', 'Dm', 'Em', 'Fm', 'Gm'];

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
    onExerciseSelect(selectedChords, duration, repeatCount, bpm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 rounded-xl p-6 w-full max-w-4xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">연습 세션 설정</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 코드 진행 및 선택 */}
            <div>
              <h3 className="text-lg font-semibold text-amber-500 mb-4">코드 진행</h3>
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedChords.map((chord, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-amber-500/20 text-amber-500 rounded-lg font-medium"
                    >
                      {chord}
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-amber-500 mb-4">코드 선택</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">메이저 코드</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {majorChords.map((chord) => (
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
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">마이너 코드</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {minorChords.map((chord) => (
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
              </div>
            </div>

            {/* 오른쪽: 연습 설정 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-4">반복 횟수</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white font-medium min-w-[4rem]">{repeatCount}회</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-4">연습 속도 (BPM)</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="40"
                    max="120"
                    step="5"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white font-medium min-w-[4rem]">{bpm} BPM</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-4">연습 시간</h3>
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
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={selectedChords.length === 0}
            className={`w-full mt-8 py-3 rounded-lg font-medium transition-colors ${
              selectedChords.length === 0
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {currentExercise ? '설정 적용하기' : '연습 시작'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PracticeSelection;
