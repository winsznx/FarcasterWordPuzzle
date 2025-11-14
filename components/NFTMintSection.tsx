'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '@/lib/contracts';

export function NFTMintSection() {
  const { address } = useAccount();
  const [selectedLevel, setSelectedLevel] = useState<1 | 2>(1);

  // Check if user has minted Level 1
  const { data: hasLevel1 } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address, 1n] : undefined,
  });

  // Check if user has minted Level 2
  const { data: hasLevel2 } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address, 2n] : undefined,
  });

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = () => {
    writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'mint',
      args: [BigInt(selectedLevel)],
      value: parseEther('0.000003'),
    });
  };

  const ownsLevel1 = hasLevel1 && Number(hasLevel1) > 0;
  const ownsLevel2 = hasLevel2 && Number(hasLevel2) > 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-brand-orange mb-4">
          Mint Level NFT
        </h2>
        <p className="text-gray-600 mb-6">
          Mint an NFT to unlock game levels. Each NFT costs 0.000003 ETH and grants lifetime access to the level.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Level 1 NFT */}
          <div
            onClick={() => !ownsLevel1 && setSelectedLevel(1)}
            className={`card cursor-pointer transition-all ${
              selectedLevel === 1 && !ownsLevel1
                ? 'ring-4 ring-brand-orange'
                : ''
            } ${ownsLevel1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-brand-orange">Level 1</h3>
              {ownsLevel1 && (
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  OWNED
                </span>
              )}
            </div>
            <div className="w-full h-40 bg-gradient-to-br from-brand-orange to-brand-tan rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">1</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Beginner Level</p>
            <p className="text-lg font-bold text-brand-brown">0.000003 ETH</p>
          </div>

          {/* Level 2 NFT */}
          <div
            onClick={() => !ownsLevel2 && setSelectedLevel(2)}
            className={`card cursor-pointer transition-all ${
              selectedLevel === 2 && !ownsLevel2
                ? 'ring-4 ring-brand-orange'
                : ''
            } ${ownsLevel2 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-brand-orange">Level 2</h3>
              {ownsLevel2 && (
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  OWNED
                </span>
              )}
            </div>
            <div className="w-full h-40 bg-gradient-to-br from-brand-tan to-brand-brown rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">2</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Advanced Level</p>
            <p className="text-lg font-bold text-brand-brown">0.000003 ETH</p>
          </div>
        </div>

        {/* Mint Button */}
        <div className="mt-6">
          {(selectedLevel === 1 && ownsLevel1) ||
          (selectedLevel === 2 && ownsLevel2) ? (
            <div className="text-center py-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <p className="text-green-700 font-bold">
                You already own this level!
              </p>
            </div>
          ) : (
            <button
              onClick={handleMint}
              disabled={isPending || isConfirming}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming
                ? 'Minting...'
                : `Mint Level ${selectedLevel} NFT (0.000003 ETH)`}
            </button>
          )}

          {isSuccess && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <p className="text-green-700 font-bold text-center">
                NFT Minted Successfully! You can now play Level {selectedLevel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
