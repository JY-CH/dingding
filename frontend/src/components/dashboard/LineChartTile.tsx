import React, { useState } from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface LineChartData {
  day: string;
  current: number;
  average: number;
}

interface LineChartTileProps {
  title: string;
  data: LineChartData[];
}

const LineChartTile: React.FC<LineChartTileProps> = ({ title, data }) => {
  const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>({
    '연습 모드': true,
    '연주 모드': true,
  });

  const handleLegendClick = (lineName: string) => {
    if (lineName in visibleLines) {
      setVisibleLines((prev) => ({
        ...prev,
        [lineName]: !prev[lineName],
      }));
    }
  };

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800/90 p-4 border border-white/10 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 mb-1 last:mb-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-zinc-400 text-xs">{entry.name}:</span>
              <span className="text-white font-medium text-xs">{entry.value} 점</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 커스텀 범례 컴포넌트
  const renderLegend = ({ payload }: { payload: { value: string; color: string }[] }) => (
    <div className="flex items-center gap-4 text-sm">
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          className="flex items-center cursor-pointer"
          onClick={() => handleLegendClick(entry.value)}
        >
          <div
            className={`w-3 h-3 mr-2 rounded-full transition-all duration-300 ${
              visibleLines[entry.value] ? 'scale-100' : 'scale-75 opacity-40'
            }`}
            style={{
              backgroundColor: entry.color,
            }}
          ></div>
          <span
            className={`${
              visibleLines[entry.value] ? 'text-white' : 'text-gray-500'
            } transition-colors`}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  // 데이터가 없는 경우 표시할 내용
  if (!data || data.length === 0) {
    return (
      <div className="p-6 backdrop-blur-lg">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
          {title}
        </h3>
        <div className="h-[250px] flex items-center justify-center text-zinc-500">
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
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
      {/* 타이틀 및 커스텀 범례 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
          {title}
        </h3>
        {renderLegend({
          payload: [
            { value: '연습 모드', color: '#F59E0B' }, // Amber-500
            { value: '연주 모드', color: '#9CA3AF' }, // Gray-400
          ],
        })}
      </div>

      {/* 반응형 라인 차트 */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="practiceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* 연습 모드 라인 */}
          {visibleLines['연습 모드'] && (
            <>
              <Line
                type="monotone"
                dataKey="current"
                stroke="#F59E0B" // Amber-500
                strokeWidth={3}
                strokeLinecap="round"
                dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#FEF3C7' }}
                activeDot={{ r: 6, fill: '#F59E0B', stroke: '#FEF3C7', strokeWidth: 2 }}
                name="연습 모드"
                animationDuration={1500}
                connectNulls
              />
            </>
          )}

          {/* 연주 모드 라인 */}
          {visibleLines['연주 모드'] && (
            <>
              <Line
                type="monotone"
                dataKey="average"
                stroke="#9CA3AF" // Gray-400
                strokeWidth={3}
                strokeDasharray="5 5"
                strokeLinecap="round"
                dot={{ r: 4, fill: '#9CA3AF', strokeWidth: 2, stroke: '#F3F4F6' }}
                activeDot={{ r: 6, fill: '#9CA3AF', stroke: '#F3F4F6', strokeWidth: 2 }}
                name="연주 모드"
                animationDuration={1500}
                connectNulls
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTile;
