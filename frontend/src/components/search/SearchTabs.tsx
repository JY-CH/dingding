import React from 'react';

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
    <div className="px-6 py-3 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
      <div className="flex space-x-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm whitespace-nowrap pb-2 transition-colors ${
              activeTab === tab.key
                ? 'text-amber-500 border-b-2 border-amber-500 font-medium'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchTabs;
