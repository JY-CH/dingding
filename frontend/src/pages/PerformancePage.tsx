import React, { useState, useEffect, useRef } from 'react';
import PerformanceHeader from '../components/performance/PerformanceHeader';
import WebcamView from '../components/performance/WebcamView';
import ChordTimeline from '../components/performance/ChordTimeline';
import { ChordNote } from '../types/performance';

const PerformancePage: React.FC = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chordNotes, setChordNotes] = useState<ChordNote[]>([]);
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null); 

  // 예시 코드 진행
  const sampleChords: ChordNote[] = [
    { id: 1, chord: 'Am', position: 1, timing: 0 },
    { id: 2, chord: 'G', position: 2, timing: 2000 },
    { id: 3, chord: 'F', position: 3, timing: 4000 },
    { id: 4, chord: 'Em', position: 4, timing: 6000 },
    { id: 5, chord: 'Dm', position: 1, timing: 8000 },
    { id: 6, chord: 'C', position: 2, timing: 10000 },
    { id: 7, chord: 'G', position: 3, timing: 12000 },
  ];

  useEffect(() => {
    setChordNotes(sampleChords);
  }, []);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    setCurrentTime(elapsed);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <PerformanceHeader isPlaying={isPlaying} onTogglePlay={togglePlay} />
      
      <div className="p-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 왼쪽: 웹캠 */}
          <div className="col-span-4">
            <WebcamView isWebcamOn={isWebcamOn} setIsWebcamOn={setIsWebcamOn} />
          </div>

          {/* 오른쪽: 코드 타임라인 */}
          <div className="col-span-8">
            <ChordTimeline chordNotes={chordNotes} isPlaying={isPlaying} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage; 