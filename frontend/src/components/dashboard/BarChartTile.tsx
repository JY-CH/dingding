import React from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
        <div className="bg-white p-2 border border-amber-200 rounded shadow-md text-xs">
          <p className="font-medium text-gray-800">{`${label}`}</p>
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-bold mb-4">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(251, 191, 36, 0.1)" }} 
              wrapperStyle={{ outline: 'none' }}
            />
            <Bar 
              dataKey="value" 
              barSize={30} 
              fill="#fbbf24" 
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