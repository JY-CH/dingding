import React from 'react';
import { GiGuitar } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

interface PerformanceHeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({ isPlaying, onTogglePlay }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/play')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <GiGuitar className="w-5 h-5" />
            <span>연습 모드</span>
          </button>
          <div className="h-8 w-px bg-white/10" />
          <h1 className="text-xl font-bold">연주 모드</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onTogglePlay}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
          >
            {isPlaying ? '일시정지' : '시작'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PerformanceHeader; 