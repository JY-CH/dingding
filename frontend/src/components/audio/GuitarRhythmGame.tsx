// src/components/GuitarRhythmGame.tsx
import React, { useState, useEffect, useRef } from 'react';

import GuitarChordRecognizer from './GuitarChordRecognizer';

interface ChordNote {
  chord: string;
  timing: number; // 밀리초 단위
  duration: number; // 밀리초 단위
}

interface GuitarRhythmGameProps {
  notes: ChordNote[];
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (finalScore: number) => void;
}

const GuitarRhythmGame: React.FC<GuitarRhythmGameProps> = ({ notes, onScoreUpdate, onGameEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [recognizerEnabled, setRecognizerEnabled] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStartTime, setGameStartTime] = useState(0);

  const animationFrameRef = useRef<number | null>(null);

  // 게임 시작
  const startGame = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    setCurrentNoteIndex(-1);
    setScore(0);
    setFeedback('준비하세요...');
    setGameStartTime(Date.now());
  };

  // 게임 중지
  const stopGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsPlaying(false);
    setRecognizerEnabled(false);

    if (onGameEnd) {
      onGameEnd(score);
    }
  };

  // 게임 타이머
  useEffect(() => {
    if (!isPlaying) return;

    const startTime = gameStartTime;

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      setCurrentTime(elapsed);

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameStartTime]);

  // 현재 노트 업데이트
  useEffect(() => {
    if (!isPlaying || notes.length === 0) return;

    // 현재 시간에 맞는 노트 찾기
    const noteIndex = notes.findIndex(
      (note, index) =>
        currentTime >= note.timing - 500 && // 0.5초 먼저 시작
        currentTime < note.timing + note.duration &&
        index > currentNoteIndex,
    );

    if (noteIndex !== -1 && noteIndex !== currentNoteIndex) {
      setCurrentNoteIndex(noteIndex);
      setRecognizerEnabled(true);
      setFeedback(`연주: ${notes[noteIndex].chord}`);

      // 노트 지속 시간이 끝나면 인식기 비활성화
      const timeUntilNoteEnd = notes[noteIndex].timing + notes[noteIndex].duration - currentTime;

      const timerId = setTimeout(() => {
        setRecognizerEnabled(false);
      }, timeUntilNoteEnd);

      return () => clearTimeout(timerId);
    }

    // 게임 종료 체크
    if (currentTime > notes[notes.length - 1].timing + notes[notes.length - 1].duration + 2000) {
      stopGame();
    }
  }, [currentTime, currentNoteIndex, isPlaying, notes, stopGame]);

  // 코드 인식 결과 처리
  const handleChordDetected = (result: {
    chord: string;
    confidence: number;
    isCorrect: boolean;
    source: 'frontend' | 'backend';
  }) => {
    if (!isPlaying || currentNoteIndex === -1) return;

    const currentNote = notes[currentNoteIndex];

    if (result.isCorrect) {
      // 점수 계산 (신뢰도와 타이밍에 따라)
      const confidenceBonus = Math.round(result.confidence * 100);

      // 타이밍 정확도 (노트 중앙에 가까울수록 높은 점수)
      const idealTime = currentNote.timing + currentNote.duration / 2;
      const timingDiff = Math.abs(currentTime - idealTime);
      const timingAccuracy = Math.max(0, 1 - timingDiff / (currentNote.duration / 2));
      const timingBonus = Math.round(timingAccuracy * 100);

      const totalPoints = 100 + confidenceBonus + timingBonus;

      // 점수 업데이트
      setScore((prev) => prev + totalPoints);
      setFeedback(
        `정확합니다! +${totalPoints} 점 (정확도: ${confidenceBonus}, 타이밍: ${timingBonus})`,
      );

      if (onScoreUpdate) {
        onScoreUpdate(score + totalPoints);
      }
    } else {
      setFeedback(`오답입니다! 예상: ${currentNote.chord}, 연주: ${result.chord}`);
    }
  };

  // 진행 표시기 계산
  const calculateProgress = () => {
    if (!isPlaying || notes.length === 0) return 0;
    const totalDuration = notes[notes.length - 1].timing + notes[notes.length - 1].duration;
    return Math.min(100, (currentTime / totalDuration) * 100);
  };

  return (
    <div className="guitar-rhythm-game">
      <div className="game-header">
        <button
          className={`game-control-button ${isPlaying ? 'stop' : 'play'}`}
          onClick={isPlaying ? stopGame : startGame}
        >
          {isPlaying ? '게임 중지' : '게임 시작'}
        </button>

        <div className="score-display">
          <span className="score-label">점수:</span>
          <span className="score-value">{score}</span>
        </div>
      </div>

      {isPlaying && (
        <div className="game-area">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${calculateProgress()}%` }} />
          </div>

          <div className="time-display">{(currentTime / 1000).toFixed(1)}초</div>

          {currentNoteIndex !== -1 && (
            <div className="current-note">
              <span className="note-label">현재 코드:</span>
              <span className="note-value">{notes[currentNoteIndex].chord}</span>
            </div>
          )}

          <div className="feedback-message">{feedback}</div>
        </div>
      )}

      <GuitarChordRecognizer
        targetChord={currentNoteIndex !== -1 ? notes[currentNoteIndex].chord : undefined}
        onChordDetected={handleChordDetected}
        enabled={recognizerEnabled && isPlaying}
        confidenceThreshold={0.65}
      />
    </div>
  );
};

export default GuitarRhythmGame;
