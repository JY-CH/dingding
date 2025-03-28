import React from 'react';

interface StatsTileProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean | null;
}

const StatsTile: React.FC<StatsTileProps> = ({ label, value, change, positive }) => {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 shadow-md">
      <p className="text-gray-400 text-sm">{label}</p>
      <div className="flex items-end mt-2">
        <span className="text-white text-2xl font-bold">{value}</span>
        {change && (
          <span className={`ml-2 text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {change} {positive ? '↗' : '↘'}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsTile;
