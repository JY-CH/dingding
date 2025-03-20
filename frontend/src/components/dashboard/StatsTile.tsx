import React from 'react';

interface StatsTileProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean | null;
}

const StatsTile: React.FC<StatsTileProps> = ({ label, value, change, positive }) => {
  return (
    <div className="bg-amber-400 rounded-lg p-4 shadow-sm">
      <p className="text-amber-800 text-sm">{label}</p>
      <div className="flex items-end mt-1">
        <span className="text-2xl font-bold">{value}</span>
        {change && (
          <span className={`ml-2 text-sm ${positive ? 'text-green-700' : 'text-red-700'}`}>
            {change} {positive ? '↗' : '↘'}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsTile;