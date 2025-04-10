import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMusicalNote, HiArrowDown, HiArrowUp } from 'react-icons/hi2';
import { Song, SongDetailResponse } from '../../types/performance';

interface SheetMusicProps {
  currentSong: Song | null;
  currentChord: string | undefined;
  songDetail: SongDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  currentSheetIndex: number;
}

interface StrokePattern {
  direction: 'up' | 'down';
  timing: number;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ currentSong, currentChord, songDetail, isLoading, error, currentSheetIndex }) => {
  const [sheetImageUrl, setSheetImageUrl] = useState<string>('');
  const [strokePatterns, setStrokePatterns] = useState<StrokePattern[]>([]);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  // 악보 이미지 로드
  useEffect(() => {
    if (currentSong?.songId && songDetail) {
      console.log('현재 선택된 곡:', currentSong.title);
      console.log('현재 악보 데이터:', songDetail.sheetMusicResponseDtos);
    }
  }, [currentSong, songDetail]);

  // 스트로크 패턴 로드
  useEffect(() => {
    if (currentChord && songDetail) {
      const currentChordData = songDetail.sheetMusicResponseDtos.filter(
        sheet => sheet.chord === currentChord
      );
      console.log('현재 코드의 데이터:', currentChordData);
    }
  }, [currentChord, songDetail]);

  return (
    <div className="h-full bg-zinc-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-white/5">
      <div className="h-full flex flex-col">
        {/* 헤더 */}
        <div className="p-2 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineMusicalNote className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white text-sm font-medium">
                {currentSong ? currentSong.title : '악보'}
              </h3>
            </div>
            {currentSong && (
              <span className="text-xs text-white/60">
                {currentSong.artist}
              </span>
            )}
          </div>
        </div>

        {/* 악보 내용 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-white/40">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">악보 로딩 중...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-rose-400 text-sm text-center px-4">
              {error}
            </div>
          ) : currentSong && songDetail ? (
            <>
              {/* 악보 이미지 영역 */}
              <div className="flex-1 overflow-auto custom-scrollbar p-4 h-full">
                <div className="max-w-4xl mx-auto">
                  {songDetail.sheetMusicResponseDtos.map((sheet, index) => (
                    <div key={sheet.sheetOrder} className="mb-8 last:mb-0">
                      <img 
                        src={sheet.sheetImage} 
                        alt={`악보 ${sheet.sheetOrder}`} 
                        className="w-full h-auto rounded-lg border border-white/20 shadow-xl shadow-black/30"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 스트로크 패턴 표시 영역 */}
              <div className="p-4 border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-2 flex justify-center items-center">
                    <div className="flex items-center gap-8">
                      {/* 이전 코드 */}
                      <div className="flex flex-col items-center">
                        <span className="text-white/30 text-xs mb-1">이전 코드</span>
                        <span className="text-white/40 text-lg">
                          {currentSheetIndex > 0 ? songDetail?.sheetMusicResponseDtos[currentSheetIndex - 1]?.chord : '없음'}
                        </span>
                      </div>

                      {/* 현재 코드 */}
                      <div className="flex flex-col items-center">
                        <span className="text-white/60 text-xs mb-1">현재 코드</span>
                        <span className="text-amber-400 text-2xl font-bold">
                          {currentChord || '없음'}
                        </span>
                      </div>

                      {/* 다음 코드 */}
                      <div className="flex flex-col items-center">
                        <span className="text-white/30 text-xs mb-1">다음 코드</span>
                        <span className="text-white/40 text-lg">
                          {songDetail?.sheetMusicResponseDtos[currentSheetIndex + 1]?.chord || '없음'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 h-16">
                    {/* 현재 코드에 해당하는 스트로크 패턴 표시 */}
                    {currentChord && songDetail?.sheetMusicResponseDtos
                      .filter(sheet => sheet.chord === currentChord)
                      .map((sheet, index) => (
                        <motion.div
                          key={`${sheet.sheetOrder}-${index}`}
                          initial={{ opacity: 0.5 }}
                          animate={{ 
                            opacity: currentBeat === index ? 1 : 0.5,
                            scale: currentBeat === index ? 1.2 : 1
                          }}
                          className={`flex flex-col items-center ${
                            currentBeat === index ? 'text-amber-400' : 'text-white/60'
                          }`}
                        >
                          {/* 임시로 up/down 패턴 표시 - 실제로는 API에서 받아온 패턴 사용 */}
                          {index % 2 === 0 ? (
                            <HiArrowDown className="w-6 h-6" />
                          ) : (
                            <HiArrowUp className="w-6 h-6" />
                          )}
                          <span className="text-xs">{index + 1}</span>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
              곡을 선택하면 악보가 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SheetMusic; 