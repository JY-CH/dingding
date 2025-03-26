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

  // 커스텀 범례 컴포넌트
  const renderLegend = ({ payload }: { payload: { value: string; color: string }[] }) => (
    <div className="flex items-center gap-4 text-sm">
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          className="flex items-center cursor-pointer"
          onClick={() => handleLegendClick(entry.value)}
        >
          <span
            className="w-3 h-3 mr-2 rounded-full"
            style={{
              backgroundColor: entry.color,
              opacity: visibleLines[entry.value] ? 1 : 0.4,
            }}
          ></span>
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

  return (
    <div className="bg-zinc-800 rounded-lg p-6 shadow-md">
      {/* 타이틀 및 커스텀 범례 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {renderLegend({
          payload: [
            { value: '연습 모드', color: '#FBBF24' }, // Amber-500
            { value: '연주 모드', color: '#9CA3AF' }, // Gray-400
          ],
        })}
      </div>

      {/* 반응형 라인 차트 */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(251, 191, 36, 0.9)', // 노란색 배경
              color: '#1F2937', // 글자 색 어두운 회색
              borderRadius: '8px', // 둥근 모서리
              border: 'none', // 테두리 제거
              padding: '10px', // 내부 여백 추가
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // 가벼운 그림자
            }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }} // 레이블 스타일
            itemStyle={{ color: '#1F2937' }} // 데이터 항목 스타일
          />

          {/* 연습 모드 라인 */}
          {visibleLines['연습 모드'] && (
            <Line
              type="monotone"
              dataKey="current"
              stroke="#FBBF24" // Amber-500
              strokeWidth={3}
              strokeLinecap="round"
              dot={{ r: 4, fill: '#FBBF24' }}
              activeDot={{ r: 6, fill: '#FBBF24' }}
              name="연습 모드"
            />
          )}

          {/* 연주 모드 라인 */}
          {visibleLines['연주 모드'] && (
            <Line
              type="monotone"
              dataKey="average"
              stroke="#9CA3AF" // Gray-400
              strokeWidth={3}
              strokeDasharray="5 5"
              strokeLinecap="round"
              dot={{ r: 4, fill: '#9CA3AF' }}
              activeDot={{ r: 6, fill: '#9CA3AF' }}
              name="연주 모드"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTile;
