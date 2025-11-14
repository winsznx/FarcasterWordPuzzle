'use client';

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '@/lib/contracts';
import { GamePlay } from './GamePlay';

export function LevelSelector() {
  const { address } = useAccount();
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | null>(null);

  // Check NFT ownership
  const { data: hasLevel1 } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address, 1n] : undefined,
  });

  const { data: hasLevel2 } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address, 2n] : undefined,
  });

  const ownsLevel1 = hasLevel1 && Number(hasLevel1) > 0;
  const ownsLevel2 = hasLevel2 && Number(hasLevel2) > 0;

  if (selectedLevel) {
    return (
      <GamePlay
        level={selectedLevel}
        onBack={() => setSelectedLevel(null)}
      />
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-brand-orange mb-4">
        Select Level to Play
      </h2>
      <p className="text-gray-600 mb-6">
        Choose a level to start playing. You must own the corresponding NFT to play.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Level 1 */}
        <div className="card">
          <h3 className="text-xl font-bold text-brand-orange mb-3">Level 1</h3>
          <div className="w-full h-32 bg-gradient-to-br from-brand-orange to-brand-tan rounded-lg mb-4 flex items-center justify-center">
            <span className="text-5xl font-bold text-white">1</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Beginner word puzzles with easier difficulty
          </p>
          {ownsLevel1 ? (
            <button
              onClick={() => setSelectedLevel(1)}
              className="btn-primary w-full"
            >
              Play Level 1
            </button>
          ) : (
            <div className="text-center py-3 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="text-red-700 font-bold text-sm">
                Mint Level 1 NFT to play
              </p>
            </div>
          )}
        </div>

        {/* Level 2 */}
        <div className="card">
          <h3 className="text-xl font-bold text-brand-orange mb-3">Level 2</h3>
          <div className="w-full h-32 bg-gradient-to-br from-brand-tan to-brand-brown rounded-lg mb-4 flex items-center justify-center">
            <span className="text-5xl font-bold text-white">2</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Advanced word puzzles with harder challenges
          </p>
          {ownsLevel2 ? (
            <button
              onClick={() => setSelectedLevel(2)}
              className="btn-primary w-full"
            >
              Play Level 2
            </button>
          ) : (
            <div className="text-center py-3 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="text-red-700 font-bold text-sm">
                Mint Level 2 NFT to play
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-brand-tan bg-opacity-20 rounded-lg border-2 border-brand-tan">
        <h4 className="font-bold text-brand-brown mb-2">Game Info</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Each play costs 0.0000001 ETH</li>
          <li>• Win rewards: 4 different tokens (~$0.05 value)</li>
          <li>• 100 total wins available across all players</li>
        </ul>
      </div>
    </div>
  );
}
