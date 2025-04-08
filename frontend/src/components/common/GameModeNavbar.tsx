import { GiGuitar } from 'react-icons/gi';
import { IoArrowBack } from 'react-icons/io5';
import { IoStatsChartOutline } from 'react-icons/io5';
import { RiMusicLine, RiSettings4Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

interface GameModeNavbarProps {
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  currentMode: 'practice' | 'performance';
}

const GameModeNavbar: React.FC<GameModeNavbarProps> = ({
  showStats,
  setShowStats,
  showSettings,
  setShowSettings,
  currentMode,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-6 pl-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 text-zinc-400 rounded-lg 
              hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <IoArrowBack className="w-5 h-5" />
            <span>메인으로</span>
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <img src="/ding.svg" alt="Ding Ding Logo" className="w-8 h-8 mt-0.5" />
            <h1 className="text-xl font-bold text-white">Ding Ding</h1>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-4 pr-8">
          {/* 연습 모드 버튼 */}
          <div className="group relative">
            <button
              onClick={() => navigate('/play')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentMode === 'practice'
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <GiGuitar className="w-5 h-5" />
              연습 모드
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full flex items-center justify-center">
              <div
                className="h-7 px-3 bg-zinc-700 rounded-lg shadow-xl 
                flex items-center justify-center
                opacity-0 group-hover:opacity-100 
                translate-y-1 group-hover:translate-y-0
                transition-all duration-200 ease-out
                pointer-events-none
                border border-zinc-600/50"
              >
                <span className="text-xs font-medium text-zinc-200 whitespace-nowrap">
                  단계별 연습과 피드백
                </span>
              </div>
            </div>
          </div>

          {/* 연주 모드 버튼 */}
          <div className="group relative">
            <button
              onClick={() => navigate('/performance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentMode === 'performance'
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <RiMusicLine className="w-5 h-5" />
              연주 모드
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full flex items-center justify-center">
              <div
                className="h-7 px-3 bg-zinc-700 rounded-lg shadow-xl 
                flex items-center justify-center
                opacity-0 group-hover:opacity-100 
                translate-y-1 group-hover:translate-y-0
                transition-all duration-200 ease-out
                pointer-events-none
                border border-zinc-600/50"
              >
                <span className="text-xs font-medium text-zinc-200 whitespace-nowrap">
                  실시간 연주 분석
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <IoStatsChartOutline className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <RiSettings4Line className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-500 font-medium">7</span>
            </div>
            <div className="text-sm">
              <div className="text-zinc-400">연습 스트릭</div>
              <div className="text-white font-medium">7일 연속</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GameModeNavbar;
