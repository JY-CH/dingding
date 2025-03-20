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
  // 각 라인의 표시 여부를 관리하는 state
  const [visibleLines, setVisibleLines] = useState({
    '연습 모드': true,
    '연주 모드': true,
  });

  const handleLegendClick = (lineName: string) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineName]: !prev[lineName],
    }));
  };

  // 커스텀 렌더러를 사용해 범례 클릭 시 스타일 변경
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex items-center gap-4 text-xs">
        {payload.map((entry: any, index: number) => (
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
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* 타이틀 및 커스텀 범례 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold">{title}</h3>
        {renderLegend({ payload: [
          { value: '연습 모드', color: '#f9a61a' },
          { value: '연주 모드', color: '#ccc' }
        ] })}
      </div>

      {/* Recharts 반응형 라인 차트 */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          {/* 그래디언트 정의 */}
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f9a61a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f9a61a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ccc" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ccc" stopOpacity={0} />
            </linearGradient>
          </defs>
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
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="연습 모드"
              fill="url(#colorCurrent)"
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
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="연주 모드"
              fill="url(#colorAverage)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTile;
