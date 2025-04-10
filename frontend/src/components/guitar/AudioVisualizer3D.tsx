import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Visualization } from '../../types/guitar';

interface AudioVisualizerProps {
  visualization: Visualization;
}

const AudioVisualizer3D: React.FC<AudioVisualizerProps> = ({ visualization }) => {
  // 적절한 민감도로 데이터 처리
  const averageLevel = useMemo(() => {
    // 중저음과 고음에 적당한 가중치 부여 (약간 낮춤)
    const weightedData = visualization.data.map((value, index) => {
      if (index < visualization.data.length * 0.3 || index > visualization.data.length * 0.7) {
        return value * 1.1; // 1.2에서 1.1로 감소
      }
      return value;
    });
    
    // 상위 50% 값들의 평균을 구해 적절하게 반응
    const sortedData = [...weightedData].sort((a, b) => b - a);
    const topValues = sortedData.slice(0, Math.ceil(sortedData.length * 0.5));
    const sum = topValues.reduce((acc, val) => acc + val, 0);
    
    // 증폭 계수 적용 (약간 낮춤)
    return Math.min((sum / topValues.length) * 1.05, 1); // 1.15에서 1.05로 감소
  }, [visualization.data]);

  // 임계값을 약간 높여 덜 민감하게 반응
  const getColor = (level: number) => {
    if (level > 0.65) return 'from-red-500 to-red-400';
    if (level > 0.35) return 'from-amber-500 to-amber-400';
    return 'from-emerald-500 to-emerald-400';
  };

  // 배경 색상 계산
  const getGlowColor = (level: number) => {
    if (level > 0.65) return 'rgba(239, 68, 68, 0.6)';
    if (level > 0.35) return 'rgba(251, 191, 36, 0.6)';
    return 'rgba(52, 211, 153, 0.6)';
  };

  return (
    <div className="w-full h-full flex items-end justify-center pb-4">
      {/* 가로로 눕힌 측정기 */}
      <div className="relative w-[85%] h-4 bg-black/40 rounded-full overflow-hidden">
        <motion.div 
          className={`absolute left-0 h-full rounded-r-full bg-gradient-to-r ${getColor(averageLevel)}`}
          style={{ 
            width: `${Math.max(averageLevel * 100, 10)}%`,
            boxShadow: `0 0 5px ${getGlowColor(averageLevel)}`
          }}
          animate={{ width: `${Math.max(averageLevel * 100, 10)}%` }}
          transition={{ duration: 0.1 }}
        />
        
        <motion.div 
          className="absolute h-full w-1 rounded-full"
          style={{
            background: getGlowColor(averageLevel),
            left: `${Math.max(averageLevel * 100, 10)}%`,
            boxShadow: `0 0 6px ${getGlowColor(averageLevel)}`
          }}
          animate={{ left: `${Math.max(averageLevel * 100, 10)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
};

export default AudioVisualizer3D;