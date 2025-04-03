import React, { useState, useCallback, memo } from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ComposedChart,
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

  const handleLegendClick = useCallback(
    (lineName: string) => {
      if (lineName in visibleLines) {
        setVisibleLines((prev) => ({
          ...prev,
          [lineName]: !prev[lineName],
        }));
      }
    },
    [visibleLines],
  );

  // 커스텀 툴팁 컴포넌트 - memo 처리
  const CustomTooltip = memo(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const filteredPayload = payload.filter(
        (entry: any) => entry.name === '연습 모드' || entry.name === '연주 모드',
      );

      return (
        <div className="bg-zinc-800/90 p-4 border border-white/10 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-white mb-2">{label}</p>
          {filteredPayload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 mb-1 last:mb-0">
              <span
                className="w-3 h-3 rounded-full"
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
  });
  // 커스텀 범례 컴포넌트 - memo 처리
  const renderLegend = useCallback(
    ({ payload }: { payload: { value: string; color: string }[] }) => (
      <div className="flex items-center gap-4 text-sm">
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
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
    ),
    [visibleLines, handleLegendClick],
  );

  // data가 없는 경우 처리
  if (!data || data.length === 0) {
    return (
      <div className="p-6 backdrop-blur-lg bg-zinc-900/70 rounded-xl">
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
    <div className="p-6 backdrop-blur-lg bg-zinc-900/70 rounded-xl">
      {/* 타이틀 및 커스텀 범례 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
          {title}
        </h3>
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-full px-4 py-2">
          {renderLegend({
            payload: [
              { value: '연습 모드', color: '#6366F1' },
              { value: '연주 모드', color: '#F59E0B' },
            ],
          })}
        </div>
      </div>

      {/* 반응형 차트 */}
      <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="practiceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.3} />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />

            <YAxis
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
              tickLine={false}
              domain={[0, 100]}
              tickCount={6}
              padding={{ top: 10, bottom: 0 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#6B7280', strokeWidth: 1, strokeDasharray: '5 5' }}
            />

            {/* 연습 모드 영역 */}
            {visibleLines['연습 모드'] && (
              <Area
                type="monotone"
                dataKey="current"
                fill="url(#practiceGradient)"
                stroke="none"
                name="연습 모드 영역"
                activeDot={false}
                isAnimationActive={true}
                animationDuration={1200}
                fillOpacity={0.2}
              />
            )}

            {/* 연주 모드 영역 */}
            {visibleLines['연주 모드'] && (
              <Area
                type="monotone"
                dataKey="average"
                fill="url(#performanceGradient)"
                stroke="none"
                name="연주 모드 영역"
                activeDot={false}
                isAnimationActive={true}
                animationDuration={1200}
                fillOpacity={0.2}
              />
            )}

            {/* 연습 모드 라인 */}
            {visibleLines['연습 모드'] && (
              <Line
                type="monotone"
                dataKey="current"
                stroke="#6366F1"
                strokeWidth={3}
                strokeLinecap="round"
                dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#E0E7FF' }}
                activeDot={{
                  r: 6,
                  fill: '#6366F1',
                  stroke: '##E0E7FF',
                  strokeWidth: 2,
                  strokeDasharray: '',
                }}
                name="연습 모드"
                animationDuration={1200}
                connectNulls
              />
            )}

            {/* 연주 모드 라인 */}
            {visibleLines['연주 모드'] && (
              <Line
                type="monotone"
                dataKey="average"
                stroke="#F59E0B"
                strokeWidth={3}
                strokeLinecap="round"
                dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#FEF3C7' }}
                activeDot={{
                  r: 6,
                  fill: '#F59E0B',
                  stroke: '#FEF3C7',
                  strokeWidth: 2,
                }}
                name="연주 모드"
                animationDuration={1200}
                connectNulls
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(LineChartTile);
