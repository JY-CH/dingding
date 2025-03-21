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
  // 인덱스 시그니처 추가로 타입 오류 해결
  const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>(
    {
      '연습 모드': true,
      '연주 모드': true,
    }
  );

  const handleLegendClick = (lineName: string) => {
    if (lineName in visibleLines) {
      setVisibleLines((prev) => ({
        ...prev,
        [lineName]: !prev[lineName],
      }));
    }
  };

  // 커스텀 범례 컴포넌트
  const renderLegend = ({ payload }: { payload: any[] }) => (
    <div className="flex items-center gap-4 text-xs">
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          className="flex items-center cursor-pointer"
          onClick={() => handleLegendClick(entry.value)}
        >
          <span
            className="w-2 h-2 mr-1 rounded-full"
            style={{
              backgroundColor: entry.color,
              opacity: visibleLines[entry.value] ? 1 : 0.4,
            }}
          ></span>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* 타이틀 및 커스텀 범례 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold">{title}</h3>
        {renderLegend({
          payload: [
            { value: '연습 모드', color: '#f9a61a' },
            { value: '연주 모드', color: '#ccc' },
          ],
        })}
      </div>

      {/* 반응형 라인 차트 */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          {/* 연습 모드 라인 */}
          {visibleLines['연습 모드'] && (
            <Line
              type="monotone"
              dataKey="current"
              stroke="#f9a61a"
              strokeWidth={3}
              strokeLinecap="round"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="연습 모드"
            />
          )}

          {/* 연주 모드 라인 */}
          {visibleLines['연주 모드'] && (
            <Line
              type="monotone"
              dataKey="average"
              stroke="#ccc"
              strokeWidth={3}
              strokeDasharray="5 5"
              strokeLinecap="round"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="연주 모드"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTile;
