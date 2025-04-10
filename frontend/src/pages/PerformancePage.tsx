import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GameModeNavbar from '../components/common/GameModeNavbar';
import WebcamView from '../components/performance/WebcamView';
import Playlist from '../components/performance/Playlist';
import ChordTimeline from '../components/performance/ChordTimeline';
import AudioVisualizer3D from '../components/guitar/AudioVisualizer3D';
import SheetMusic from '../components/performance/SheetMusic';
import { fetchSongDetail, fetchAllSongs } from '../services/api';
import { Visualization } from '../types/guitar';
import { Song, ChordChange, SongDetailResponse } from '../types/performance';

const PerformancePage: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentChord, setCurrentChord] = useState<ChordChange | null>(null);
  const [songDetail, setSongDetail] = useState<SongDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  // 시각화 데이터
  const [visualization, setVisualization] = useState<Visualization>({
    type: '3d',
    data: new Array(128).fill(0),
    peak: 1,
  });

  // 곡 목록 가져오기
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllSongs();
        
        // API 응답 유효성 검사
        if (!response) {
          throw new Error('곡 목록을 불러올 수 없습니다.');
        }

        // API 응답을 Song 타입으로 변환
        const convertedSongs: Song[] = (response || []).map(song => ({
          id: song.songId,
          songId: song.songId,
          title: song.songTitle || '',
          artist: song.songSinger || '',
          duration: song.songDuration || '',
          songTitle: song.songTitle || '',
          songImage: song.songImage || '',
          songWriter: song.songWriter || '',
          songSinger: song.songSinger || '',
          songVoiceFileUrl: song.songVoiceFileUrl || '',
          releaseDate: song.releaseDate || '',
          category: song.category || '',
          songDuration: song.songDuration || '',
          notes: [], // 초기에는 빈 배열로 설정
        }));

        console.log('로드된 곡 목록:', convertedSongs); // 디버깅용
        setSongs(convertedSongs);
      } catch (err) {
        console.error('곡 목록 로드 실패:', err);
        setError(err instanceof Error ? err.message : '곡 목록을 불러오는데 실패했습니다.');
        setSongs([]); // 에러 시 빈 배열로 설정
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  const handleSongSelect = async (song: Song) => {
    try {
      setIsLoading(true);
      setError(null);
      const detail = await fetchSongDetail(song.songId);
      console.log('곡 상세 정보:', detail); // 상세 정보 전체 로그
      console.log('악보 및 코드 정보:', detail.sheetMusicResponseDtos); // 악보/코드 정보만 로그
      setSongDetail(detail);
      setCurrentSong(song);
    } catch (err) {
      setError(err instanceof Error ? err.message : '곡 정보를 불러오는데 실패했습니다.');
      console.error('곡 상세 정보 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 오디오 초기화 및 시각화 효과
  useEffect(() => {
    let isActive = true;

    const initAudio = async () => {
      try {
        const context = new AudioContext();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 64;
        analyserNode.smoothingTimeConstant = 0.8;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);

        if (isActive) {
          setAudioContext(context);
          setAnalyser(analyserNode);

          const updateVisualization = () => {
            if (!isActive) return;

            const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
            analyserNode.getByteFrequencyData(dataArray);

            setVisualization((prev) => ({
              ...prev,
              data: Array.from(dataArray).map((value) => (value / 255) * 0.7),
              peak: Math.max(...dataArray) / 255 || 1,
            }));

            animationFrameRef.current = requestAnimationFrame(updateVisualization);
          };

          updateVisualization();
        }
      } catch (err) {
        console.error('마이크 접근 실패:', err);
      }
    };

    initAudio();

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContext?.close();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* 네비바 */}
      <div className="h-16">
        <GameModeNavbar
          showStats={showStats}
          setShowStats={setShowStats}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          currentMode="performance"
        />
      </div>

      {/* 상단 컴포넌트 영역 */}
      <div className="h-[calc(44vh-4rem)] flex gap-4 p-4">
        {/* 플레이리스트 - 가로 크기 축소 */}
        <motion.div 
          className="w-[35%] h-full bg-black/20 rounded-xl overflow-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Playlist 
            onSongSelect={handleSongSelect} 
            initialSongs={songs}
          />
        </motion.div>

        {/* 악보 - 가로 크기 확장 */}
        <motion.div
          className="w-[35%] h-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-full">
            <SheetMusic
              currentSong={currentSong}
              currentChord={currentChord?.chord}
              songDetail={songDetail}
              isLoading={isLoading}
              error={error}
              currentSheetIndex={currentSheetIndex}
              visualization={visualization}
            />
          </div>
        </motion.div>
        
        {/* 오른쪽 영역: 음향 시각화 + 웹캠 */}
        <div className="w-[30%] h-full flex gap-4">
          {/* 음향 시각화 (데시벨 측정기) - 숨김 처리 */}
          <motion.div 
            className="hidden w-[8%] h-full bg-black/20 rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AudioVisualizer3D visualization={visualization} />
          </motion.div>
          
          {/* 웹캠 - 전체 너비 사용 */}
          <motion.div 
            className="w-full h-full bg-black/20 rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <WebcamView isWebcamOn={isWebcamOn} setIsWebcamOn={setIsWebcamOn} />
          </motion.div>
        </div>
      </div>

      {/* 코드 타임라인 영역 */}
      <motion.div 
        className="flex-1 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="h-full bg-black/20 rounded-xl overflow-hidden">
          <ChordTimeline
            isPlaying={isPlaying}
            currentSong={currentSong}
            notes={[]}
            currentChord={currentChord}
            onPlayingChange={setIsPlaying}
            onChordChange={setCurrentChord}
            songDetail={songDetail}
            onSheetIndexChange={setCurrentSheetIndex}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PerformancePage;
