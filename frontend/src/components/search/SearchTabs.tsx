import React from 'react';
import { motion } from 'framer-motion';

interface SearchTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { key: 'all', label: '전체' },
  { key: 'artists', label: '아티스트' },
  { key: 'albums', label: '앨범' },
  { key: 'community', label: '커뮤니티' },
];

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="px-6 py-3">
      <div className="flex space-x-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative text-sm whitespace-nowrap px-3 py-2 rounded-lg transition-all"
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-amber-500/80 to-amber-600/80 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span
              className={`relative z-10 font-medium ${
                activeTab === tab.key ? 'text-zinc-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchTabs;
