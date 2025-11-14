'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@/components/ConnectButton';
import { GameDashboard } from '@/components/GameDashboard';

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-brand-orange text-2xl font-bold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-brand-orange">
                Word Puzzle Game
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                NFT-Gated Puzzle Challenge
              </p>
            </div>
            <div className="absolute right-4">
              <ConnectButton />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={() => router.push('/talent')}
              className="text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <span>🎯</span>
              <span>My Talent Profile</span>
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isConnected ? (
          <GameDashboard />
        ) : (
          <div className="text-center py-20">
            <div className="card max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-brand-orange mb-4">
                Welcome to Word Puzzle!
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Solve word puzzles, earn crypto rewards. Connect your wallet to get started.
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Mint Level NFT</h3>
                    <p className="text-gray-600">Get access for just 0.000003 ETH</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Play & Win</h3>
                    <p className="text-gray-600">Solve puzzles for 0.0000001 ETH per play</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Claim Rewards</h3>
                    <p className="text-gray-600">Earn 4 different tokens per win</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Talent Bonus</h3>
                    <p className="text-gray-600">High Talent scores earn up to 2x bonus rewards!</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
