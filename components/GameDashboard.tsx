'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFTMintSection } from './NFTMintSection';
import { LevelSelector } from './LevelSelector';
import { PlayerStats } from './PlayerStats';

export function GameDashboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'mint' | 'play' | 'stats'>('mint');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="card">
        <div className="flex gap-1 sm:gap-2 border-b-2 border-brand-tan pb-2">
          <button
            onClick={() => setActiveTab('mint')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-t-lg font-bold text-xs sm:text-base transition-colors ${
              activeTab === 'mint'
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Mint NFT
          </button>
          <button
            onClick={() => setActiveTab('play')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-t-lg font-bold text-xs sm:text-base transition-colors ${
              activeTab === 'play'
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Play Game
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-t-lg font-bold text-xs sm:text-base transition-colors ${
              activeTab === 'stats'
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Stats
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'mint' && <NFTMintSection />}
        {activeTab === 'play' && <LevelSelector />}
        {activeTab === 'stats' && <PlayerStats />}
      </div>
    </div>
  );
}
