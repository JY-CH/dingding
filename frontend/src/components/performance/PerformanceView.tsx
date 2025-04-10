import React, { useState, useEffect, useRef } from 'react';
import Playlist from './Playlist';
import ChordTimeline from './ChordTimeline';
import HitEffect from './HitEffect';
import ComboText from './ComboText';
import { Song, Note, HitResult, HIT_WINDOWS, ChordChange } from '../../types/performance';
import {
  calculateTimingDifference,
  calculateHitResult,
  calculateAccuracy,
  calculateScore,
  findNearestNote,
  findChordChange,
  calculateChordHitResult
} from '../../utils/hitDetection';
import WebcamView from './WebcamView';

const PerformanceView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [hitResult, setHitResult] = useState<HitResult>({
    perfect: 0,
    good: 0,
    miss: 0,
    combo: 0,
    score: 0,
    accuracy: 100,
    maxCombo: 0
  });
  const [hitEffects, setHitEffects] = useState<Array<{
    id: number;
    stringNumber: number;
    position: number;
    type: 'perfect' | 'good' | 'miss';
  }>>([]);
  const [showCombo, setShowCombo] = useState(false);
  const startTimeRef = useRef<number>(0);
  const [pressedStrings, setPressedStrings] = useState<number[]>([]);
  const [currentChord, setCurrentChord] = useState<ChordChange | null>(null);
  const [, setCurrentTime] = useState(0);
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  // 디버깅을 위한 로그
  console.log('PerformanceView 렌더링:', { isPlaying, currentSong, notes, currentChord });

  const handleSongSelect = (song: Song) => {
    console.log('곡 선택:', song);
    setCurrentSong(song);
    setIsPlaying(false);
    setCurrentTime(0);
    setHitResult({
      score: 0,
      combo: 0,
      perfect: 0,
      good: 0,
      miss: 0,
      accuracy: 100,
      maxCombo: 0
    });
    setHitEffects([]);
    setShowCombo(false);
    
    // 노트 데이터 확인 및 설정
    if (song.notes && Array.isArray(song.notes) && song.notes.length > 0) {
      console.log('노트 데이터 설정:', song.notes);
      setNotes(song.notes);
    } else {
      console.log('노트 데이터가 없거나 잘못된 형식입니다.');
      setNotes([]);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      startTimeRef.current = Date.now();
    }
    setIsPlaying(!isPlaying);
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaying || !currentSong) return;

      const key = event.key;
      const stringNumber = parseInt(key);
      
      if (stringNumber >= 1 && stringNumber <= 6) {
        setPressedStrings(prev => [...prev, stringNumber]);
        
        const currentTime = Date.now() - startTimeRef.current;
        const hitWindow = currentSong?.difficulty ? HIT_WINDOWS[currentSong.difficulty] : HIT_WINDOWS['medium'];
        
        // 코드 변경 확인
        const chord = findChordChange(notes, currentTime, hitWindow);
        if (chord) {
          setCurrentChord(chord);
          const hitType = calculateChordHitResult(chord, [...pressedStrings, stringNumber], currentTime, hitWindow);
          
          if (hitType !== 'miss') {
            // 코드 변경 성공 처리
            setHitEffects(prev => [...prev, {
              id: Date.now(),
              stringNumber,
              position: getStringPosition(stringNumber - 1),
              type: hitType
            }]);

            setShowCombo(true);
            setTimeout(() => setShowCombo(false), 1000);

            setHitResult(prev => {
              const newCombo = prev.combo + 1;
              const newMaxCombo = Math.max(prev.maxCombo, newCombo);
              const score = calculateScore(hitType, newCombo);
              
              return {
                ...prev,
                [hitType]: prev[hitType] + 1,
                combo: newCombo,
                maxCombo: newMaxCombo,
                score: prev.score + score,
                accuracy: Math.round((prev.accuracy * (prev.perfect + prev.good + prev.miss) + 100) / (prev.perfect + prev.good + prev.miss + 1))
              };
            });

            // 코드 노트 제거
            setNotes(prev => prev.filter(note => note.chordId !== chord.id));
            setCurrentChord(null);
          }
        } else {
          // 단일 노트 처리
          const nearestNote = findNearestNote(notes, stringNumber, currentTime, hitWindow);

          if (nearestNote) {
            const timingDiff = calculateTimingDifference(nearestNote, currentTime);
            const hitType = calculateHitResult(timingDiff, hitWindow);
            const accuracy = calculateAccuracy(timingDiff, hitWindow);
            
            // 히트 효과 추가
            setHitEffects(prev => [...prev, {
              id: Date.now(),
              stringNumber,
              position: getStringPosition(stringNumber - 1),
              type: hitType
            }]);

            // 콤보 표시
            if (hitType !== 'miss') {
              setShowCombo(true);
              setTimeout(() => setShowCombo(false), 1000);
            }

            // 결과 업데이트
            setHitResult(prev => {
              const newCombo = hitType === 'miss' ? 0 : prev.combo + 1;
              const newMaxCombo = Math.max(prev.maxCombo, newCombo);
              const score = calculateScore(hitType, newCombo);
              
              return {
                ...prev,
                [hitType]: prev[hitType] + 1,
                combo: newCombo,
                maxCombo: newMaxCombo,
                score: prev.score + score,
                accuracy: Math.round((prev.accuracy * (prev.perfect + prev.good + prev.miss) + accuracy) / (prev.perfect + prev.good + prev.miss + 1))
              };
            });

            // 히트한 노트 제거
            setNotes(prev => prev.filter(note => note.id !== nearestNote.id));
          } else {
            // 미스 처리
            setHitEffects(prev => [...prev, {
              id: Date.now(),
              stringNumber,
              position: getStringPosition(stringNumber - 1),
              type: 'miss'
            }]);

            setHitResult(prev => ({
              ...prev,
              miss: prev.miss + 1,
              combo: 0,
              accuracy: Math.round((prev.accuracy * (prev.perfect + prev.good + prev.miss)) / (prev.perfect + prev.good + prev.miss + 1))
            }));
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;
      const stringNumber = parseInt(key);
      
      if (stringNumber >= 1 && stringNumber <= 6) {
        setPressedStrings(prev => prev.filter(num => num !== stringNumber));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, currentSong, notes, pressedStrings]);

  // 히트 효과 제거
  useEffect(() => {
    const timer = setInterval(() => {
      setHitEffects(prev => prev.filter(effect => Date.now() - effect.id < 500));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const getStringPosition = (index: number) => {
    const basePosition = 8;
    let position = basePosition;
    for (let i = 0; i < index; i++) {
      position += 8 + (i * 2);
    }
    return position;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* 상단 영역 - 플레이리스트 & 웹캠 */}
      <div className="flex h-1/2 bg-gradient-to-b from-zinc-900 to-black">
        {/* 왼쪽 영역 (플레이리스트) */}
        <div className="w-1/3 p-4">
          <div className="h-full bg-gray-800/50 rounded-lg overflow-hidden">
            <Playlist onSongSelect={handleSongSelect} initialSongs={[]} />
          </div>
        </div>
        
        {/* 오른쪽 영역 (웹캠) */}
        <div className="w-2/3 p-4">
          <div className="h-full bg-gray-800/50 rounded-lg overflow-hidden">
            <WebcamView 
              isWebcamOn={isWebcamOn} 
              setIsWebcamOn={setIsWebcamOn} 
            />
          </div>
        </div>
      </div>

      {/* 하단 영역 - ChordTimeline */}
      <div className="relative h-1/2 bg-black">
        <div className="absolute inset-0">
          <ChordTimeline
            isPlaying={isPlaying}
            currentSong={currentSong}
            notes={notes}
            currentChord={currentChord}
            onPlayingChange={setIsPlaying}
            onChordChange={setCurrentChord}
            songDetail={null}
            onSheetIndexChange={() => {}}
          />
          {hitEffects.map(effect => (
            <HitEffect
              key={effect.id}
              stringNumber={effect.stringNumber}
              position={effect.position}
              type={effect.type}
            />
          ))}
          <ComboText
            combo={hitResult.combo}
            isVisible={showCombo}
          />
        </div>

        {/* 점수 및 컨트롤 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 py-3 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-6">
            <div className="text-white">
              <span className="text-amber-400">Perfect: </span>
              {hitResult.perfect}
            </div>
            <div className="text-white">
              <span className="text-green-400">Good: </span>
              {hitResult.good}
            </div>
            <div className="text-white">
              <span className="text-red-400">Miss: </span>
              {hitResult.miss}
            </div>
            <div className="text-white">
              <span className="text-blue-400">Combo: </span>
              {hitResult.combo}
            </div>
            <div className="text-white">
              <span className="text-yellow-400">Score: </span>
              {hitResult.score}
            </div>
            <div className="text-white">
              <span className="text-purple-400">Accuracy: </span>
              {hitResult.accuracy}%
            </div>
          </div>
          <button
            onClick={handlePlayPause}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceView; 