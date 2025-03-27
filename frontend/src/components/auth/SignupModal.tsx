import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { signup } from '@/services/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await signup({
        loginId,
        password,
        username
      });

      // 회원가입 성공
      onClose();
      // 선택적: 회원가입 성공 후 로그인 모달로 전환하거나 자동 로그인
      alert(`${response.username}님, 환영합니다!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '회원가입에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      
      <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 p-6 shadow-xl transition-all">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">회원가입</h2>
          <p className="text-zinc-400">ThingThing의 멤버가 되어보세요</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="loginId" className="block text-sm font-medium text-zinc-300 mb-1.5">
              아이디
            </label>
            <input
              type="text"
              id="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                transition-colors"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1.5">
              닉네임
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                transition-colors"
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-amber-500 text-white rounded-lg font-medium
              hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 
              focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                가입 중...
              </div>
            ) : '가입하기'}
          </button>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default SignupModal; 