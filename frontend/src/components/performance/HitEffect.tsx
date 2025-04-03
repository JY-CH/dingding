import React from 'react';
import { motion } from 'framer-motion';

interface HitEffectProps {
  stringNumber: number;
  position: number;
  type: 'perfect' | 'good' | 'miss';
}

const HitEffect: React.FC<HitEffectProps> = ({ stringNumber, position, type }) => {
  const getColor = () => {
    switch (type) {
      case 'perfect':
        return 'rgba(251, 191, 36, 0.8)'; // amber-400
      case 'good':
        return 'rgba(34, 197, 94, 0.8)'; // green-500
      case 'miss':
        return 'rgba(239, 68, 68, 0.8)'; // red-500
      default:
        return 'rgba(251, 191, 36, 0.8)';
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        top: `${position}%`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="w-16 h-16 rounded-full"
        style={{
          background: `radial-gradient(circle, ${getColor()} 0%, transparent 70%)`,
          boxShadow: `0 0 20px ${getColor()}, 0 0 40px ${getColor()}`,
        }}
      />
    </motion.div>
  );
};

export default HitEffect; 