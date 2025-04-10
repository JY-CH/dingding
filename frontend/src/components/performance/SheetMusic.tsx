import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi2';
import { Song, SongDetailResponse } from '../../types/performance';

interface SheetMusicProps {
  currentSong: Song | null;
  currentChord: string | undefined;
  songDetail: SongDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  currentSheetIndex: number;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ currentSong, currentChord, songDetail, isLoading, error, currentSheetIndex }) => {
  const [currentBeat, /* setCurrentBeat */] = useState<number>(0);

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
    <div className="h-full bg-black/20 rounded-xl overflow-hidden flex flex-col">
      {/* 악보 헤더 */}
      <div className="border-b border-white/10 p-3 bg-black/30 flex justify-between items-center">
        <div>
          <h3 className="text-white text-sm font-medium">
            {currentSong 
              ? currentSong.title
              : "악보를 표시할 곡을 선택하세요"}
          </h3>
          {currentSong && (
            <p className="text-white/60 text-xs">
              {currentSong.artist}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40">박자: {currentBeat}/4</span>
        </div>
      </div>
      
      {/* 악보 내용 */}
      <div className="flex-1 flex items-center justify-center relative overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="text-white opacity-60 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>악보 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 text-center">
            <p>❌ {error}</p>
            <p className="text-sm text-white/60 mt-2">다른 곡을 선택해보세요</p>
          </div>
        ) : !songDetail ? (
          <div className="text-white/60 text-center p-4">
            <p>악보를 표시할 곡을 선택하세요</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-full max-h-full p-4 flex flex-col items-center justify-center">
              {songDetail.sheetMusicResponseDtos.map((sheet) => (
                <div 
                  key={`sheet-${sheet.sheetOrder}`}
                  className={`w-full transition-all duration-300 ${
                    sheet.sheetOrder === currentSheetIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
                  }`}
                >
                  <img 
                    src={sheet.sheetImage} 
                    alt={`Sheet ${sheet.sheetOrder}`} 
                    className="max-w-full max-h-full object-contain shadow-xl rounded-lg"
                    style={{
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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
    </div>
  );
};

export default SheetMusic; 