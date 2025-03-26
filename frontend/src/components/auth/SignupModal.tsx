import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 실제 회원가입 로직 구현 필요
      await new Promise(resolve => setTimeout(resolve, 1500));
      onClose();
    } catch (error) {
      console.error('Signup failed:', error);
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
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-zinc-300 mb-1.5">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1.5">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

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