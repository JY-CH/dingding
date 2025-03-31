import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsTileProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean | null;
  icon?: React.ReactNode;
}

const StatsTile: React.FC<StatsTileProps> = ({ label, value, change, positive, icon }) => {
  return (
    <div className="bg-zinc-800/90 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-amber-500/5 group">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">{label}</p>
      </div>
      <div className="flex items-end mt-3">
        <span className="text-white text-2xl font-bold group-hover:text-amber-500 transition-colors">
          {value}
        </span>
        {change && (
          <span
            className={`ml-2 text-sm flex items-center gap-1 ${
              positive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {change}
            <span className="inline-block">{positive ? '↗' : '↘'}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsTile;
