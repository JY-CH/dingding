import React from 'react';

interface RealtimeFeedbackProps {
  feedback: string;
  isPositive: boolean;
}

const RealtimeFeedback: React.FC<RealtimeFeedbackProps> = ({ feedback, isPositive }) => {
  return (
    <div className="h-full bg-gray-800/50 rounded-lg p-8 flex flex-col justify-center items-center">
      <div className={`text-xl font-medium ${isPositive ? 'text-emerald-400' : 'text-amber-400'} text-center leading-relaxed`}>
        {feedback}
      </div>
    </div>
  );
};

export default RealtimeFeedback; 