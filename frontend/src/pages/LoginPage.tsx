import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';

const LoginPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [currentBg, setCurrentBg] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // 1부터 12까지의 랜덤 숫자 생성
    const randomBg = Math.floor(Math.random() * 12) + 1;
    setCurrentBg(randomBg);
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 transition-opacity duration-1000 flex items-center justify-center bg-black">
        <img 
          src={`/src/assets/bg${currentBg}.jpg`}
          alt="background"
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{
            filter: 'brightness(0.9) saturate(0.95)',
          }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            const newBg = (currentBg % 12) + 1;
            img.src = `/src/assets/bg${newBg}.jpg`;
          }}
        />
      </div>

      {/* 컨텐츠 */}
      <div className="absolute inset-0 flex flex-col">
        {/* 헤더 */}
        <nav className="p-8 pl-24">
          <div className="inline-flex items-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <svg className="w-12 h-12 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span className="ml-2 text-2xl font-bold text-white">ThingThing</span>
            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">로그인</h1>
              <p className="mt-2 text-white/90 text-lg drop-shadow">ThingThing에서 음악을 시작하세요</p>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 
                  text-white rounded-lg font-medium text-lg
                  hover:from-amber-600 hover:to-amber-700 
                  focus:outline-none focus:ring-2 focus:ring-amber-500 
                  focus:ring-offset-2 focus:ring-offset-black/20 
                  transition-all shadow-lg"
              >
                로그인하기
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/70">또는</span>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg
                  text-white font-medium flex items-center justify-center gap-3
                  hover:bg-white/20 transition-colors shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google로 계속하기
                </button>
                <button className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg
                  text-white font-medium flex items-center justify-center gap-3
                  hover:bg-white/20 transition-colors shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.488 4.79c.257-1.068.64-2.137 1.175-3.206-1.092.308-2.129.78-3.037 1.405a8.77 8.77 0 00-1.994 1.964c-.88 1.184-1.472 2.576-1.472 4.047 0 1.555.52 3.018 1.475 4.176.955 1.158 2.254 1.962 3.754 2.212a4.356 4.356 0 01-.123-1.012c0-1.024.363-1.964.97-2.684.606-.72 1.425-1.224 2.34-1.224.915 0 1.734.504 2.34 1.224.607.72.97 1.66.97 2.684 0 .34-.041.676-.123 1.012 1.5-.25 2.799-1.054 3.754-2.212.955-1.158 1.475-2.621 1.475-4.176 0-1.471-.592-2.863-1.472-4.047a8.77 8.77 0 00-1.994-1.964c-.908-.625-1.945-1.097-3.037-1.405.535 1.069.918 2.138 1.175 3.206.362 1.507.362 3.049 0 4.556-.362-1.507-.918-2.897-1.668-4.167-.75-1.27-1.667-2.38-2.751-3.327-1.084.947-2.001 2.057-2.751 3.327-.75 1.27-1.306 2.66-1.668 4.167-.362-1.507-.362-3.049 0-4.556z" />
                  </svg>
                  Apple로 계속하기
                </button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-white/90 drop-shadow">
                계정이 없으신가요?{' '}
                <button 
                  onClick={() => setIsSignupModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  회원가입
                </button>
              </p>
              <p className="text-sm text-white/80 drop-shadow">
                계속 진행하면 ThingThing의{' '}
                <a href="#" className="text-amber-400 hover:text-amber-300">서비스 약관</a>과{' '}
                <a href="#" className="text-amber-400 hover:text-amber-300">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage; 