import React, { memo } from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartTileProps {
  title: string;
  data: BarChartData[];
}

const BarChartTile: React.FC<BarChartTileProps> = ({ title, data }) => {
  // 커스텀 툴팁 메모이제이션
  const CustomTooltip = memo(({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800/90 p-4 border border-white/10 rounded-lg shadow-lg text-xs backdrop-blur-sm">
          <p className="font-medium text-white text-sm mb-1">{`${label}`}</p>
          <p className="text-amber-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-medium">정확도: </span>
            <span className="text-white">{`${payload[0].value}%`}</span>
          </p>
        </div>
      );
    }
    return null;
  });

  // 데이터가 없는 경우 표시할 내용
  if (!data || data.length === 0) {
    return (
      <div className="p-6 backdrop-blur-lg">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
          {title}
        </h3>
        <div className="h-48 flex items-center justify-center text-zinc-500">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p>아직 데이터가 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 backdrop-blur-lg">
      {/* 타이틀 */}
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
        {title}
      </h3>

      {/* 반응형 바 차트 - 애니메이션 시간 단축 */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0}}>
            {/* X축 */}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
            />
            {/* Y축 */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            {/* 툴팁 */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
              wrapperStyle={{ outline: 'none' }}
            />
            {/* 바 */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              {/* 간소화된 필터 */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <Bar
              dataKey="value"
              barSize={30}
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
              filter="url(#glow)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(BarChartTile);
