import { GiGuitar } from 'react-icons/gi';
// import { IoArrowBack } from 'react-icons/io5';
import { RiMusicLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HiChevronLeft } from 'react-icons/hi';

interface GameModeNavbarProps {
  currentMode: 'practice' | 'performance';
}

const GameModeNavbar: React.FC<GameModeNavbarProps> = ({
  currentMode,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-6 pl-4">
          <Link to="/" className="text-white/60 hover:text-white transition-colors">
            <HiChevronLeft className="w-6 h-6" />
          </Link>
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
        </div>
      </div>
    </nav>
  );
};

export default GameModeNavbar;
