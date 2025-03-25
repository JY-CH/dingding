import { useState } from 'react';

import HotContent from '@/components/search/HotContent';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import SearchTabs from '@/components/search/SearchTabs';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-zinc-900">
      <SearchBar query={query} setQuery={setQuery} />
      <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {query.trim() === '' ? <HotContent /> : <SearchResults activeTab={activeTab} />}
    </div>
  );
}
