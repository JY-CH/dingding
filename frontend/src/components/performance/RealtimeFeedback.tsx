import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealtimeFeedbackProps {
  feedback: string;
  isPositive: boolean;
}

const RealtimeFeedback: React.FC<RealtimeFeedbackProps> = ({ feedback, isPositive }) => {
  return (
    <div className="h-full bg-black/30 backdrop-blur-sm rounded-xl p-6 flex flex-col border border-white/10 shadow-xl">
      <div className="flex items-center mb-3">
        <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-amber-500'} mr-2`}></div>
        <h3 className="text-sm font-semibold text-white/80">실시간 피드백</h3>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={feedback} // 키가 변경될 때마다 애니메이션 트리거
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`p-5 rounded-lg ${isPositive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}
          >
            <motion.p
              className={`text-xl font-medium ${isPositive ? 'text-emerald-400' : 'text-amber-400'} text-center leading-relaxed`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {feedback}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex justify-end">
        <div className="text-xs text-white/40 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse mr-1"></span>
          분석 중...
        </div>
      </div>
    </div>
  );
};

export default RealtimeFeedback; 