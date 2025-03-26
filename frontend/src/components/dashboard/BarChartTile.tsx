import React from 'react';

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
  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 p-3 border border-zinc-700 rounded shadow-md text-xs">
          <p className="font-medium text-white">{`${label}`}</p>
          <p className="text-amber-500">
            <span className="font-medium">정확도: </span>
            <span>{`${payload[0].value}%`}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-6 shadow-md">
      {/* 타이틀 */}
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>

      {/* 반응형 바 차트 */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
              cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }} // Amber-500 투명도
              wrapperStyle={{ outline: 'none' }}
            />
            {/* 바 */}
            <Bar
              dataKey="value"
              barSize={30}
              fill="#FBBF24" // Amber-500
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartTile;
