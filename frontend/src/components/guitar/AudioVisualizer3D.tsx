import React from 'react';
import { Visualization } from '../../types/guitar';

interface AudioVisualizer3DProps {
  visualization: Visualization;
}

const AudioVisualizer3D: React.FC<AudioVisualizer3DProps> = ({ visualization }) => {
  // 데이터를 32개로 줄임 (더 적은 막대)
  const reducedData = visualization.data.filter((_, index) => index % 2 === 0);

  return (
    <div className="w-full h-28 bg-black/20 rounded-lg overflow-hidden">
      {/* 시각화 렌더링 */}
      <div className="w-full h-full flex items-end justify-center gap-1 p-2">
        {reducedData.map((value, index) => (
          <div
            key={index}
            className="flex-1 min-w-[4px] max-w-[8px] rounded-t bg-gradient-to-t from-amber-500 to-amber-400"
            style={{
              height: `${value * 100}%`,
              transformOrigin: 'bottom',
              transition: 'height 80ms' // 트랜지션 시간 증가로 더 부드럽게
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer3D; 