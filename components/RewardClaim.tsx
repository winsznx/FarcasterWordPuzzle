'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { base, celo } from 'wagmi/chains';
import { BASE_VAULT_CONTRACT_ADDRESS, CELO_VAULT_CONTRACT_ADDRESS, VAULT_ABI } from '@/lib/contracts';

interface RewardClaimProps {
  signature: {
    base: {
      databytes: string;
      v: number;
      r: string;
      s: string;
    };
    celo: {
      databytes: string;
      v: number;
      r: string;
      s: string;
    };
  };
  onClose: () => void;
  onShare: () => void;
}

export function RewardClaim({ signature, onClose, onShare }: RewardClaimProps) {
  const [claimStep, setClaimStep] = useState<'base' | 'celo' | 'complete'>('base');
  const { switchChain } = useSwitchChain();

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaimBase = async () => {
    // Switch to Base
    await switchChain({ chainId: base.id });

    writeContract({
      address: BASE_VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'claim',
      args: [
        signature.base.databytes as `0x${string}`,
        signature.base.v,
        signature.base.r as `0x${string}`,
        signature.base.s as `0x${string}`
      ],
    });
  };

  const handleClaimCelo = async () => {
    // Switch to Celo
    await switchChain({ chainId: celo.id });

    writeContract({
      address: CELO_VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'claim',
      args: [
        signature.celo.databytes as `0x${string}`,
        signature.celo.v,
        signature.celo.r as `0x${string}`,
        signature.celo.s as `0x${string}`
      ],
    });
  };

  const handleClaim = () => {
    if (claimStep === 'base') {
      handleClaimBase();
    } else if (claimStep === 'celo') {
      handleClaimCelo();
    }
  };

  // Auto-advance to next step when claim succeeds
  if (isSuccess && claimStep === 'base') {
    setClaimStep('celo');
  } else if (isSuccess && claimStep === 'celo') {
    setClaimStep('complete');
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">🏆</span>
        </div>
        <h2 className="text-3xl font-bold text-brand-orange mb-2">
          Claim Your Rewards!
        </h2>
        <p className="text-gray-600">
          Multi-chain rewards on Base + Celo
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center gap-2 mb-6">
        <div className={`px-4 py-2 rounded-lg font-medium ${
          claimStep === 'base' ? 'bg-blue-500 text-white' :
          (claimStep === 'celo' || claimStep === 'complete') ? 'bg-green-500 text-white' : 'bg-gray-200'
        }`}>
          1. Base Network
        </div>
        <div className={`px-4 py-2 rounded-lg font-medium ${
          claimStep === 'celo' ? 'bg-blue-500 text-white' :
          claimStep === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-200'
        }`}>
          2. Celo Network
        </div>
      </div>

      {/* Base Rewards */}
      {(claimStep === 'base' || claimStep === 'celo' || claimStep === 'complete') && (
        <div className="mb-4">
          <h3 className="font-bold text-blue-600 mb-2">🔵 Base Network Rewards</h3>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-lg flex justify-between items-center">
              <span className="font-medium text-purple-900">Puzzle Token (PUZZ)</span>
              <span className="font-bold text-purple-900">10 PUZZ</span>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg flex justify-between items-center">
              <span className="font-medium text-green-900">WCT Token</span>
              <span className="font-bold text-green-900">0.1 WCT</span>
            </div>
          </div>
        </div>
      )}

      {/* Celo Rewards */}
      {(claimStep === 'celo' || claimStep === 'complete') && (
        <div className="mb-4">
          <h3 className="font-bold text-yellow-600 mb-2">🟡 Celo Network Rewards</h3>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-lg flex justify-between items-center">
              <span className="font-medium text-blue-900">Reward Token (RWRD)</span>
              <span className="font-bold text-blue-900">10 RWRD</span>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-lg flex justify-between items-center">
              <span className="font-medium text-yellow-900">CELO</span>
              <span className="font-bold text-yellow-900">0.05 CELO</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-brand-tan bg-opacity-20 p-4 rounded-lg border-2 border-brand-tan mb-6">
        <p className="text-sm text-center text-brand-brown">
          <strong>Total Rewards:</strong> 10 PUZZ + 10 RWRD + 0.1 WCT + 0.05 CELO
        </p>
      </div>

      {claimStep !== 'complete' ? (
        <div>
          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className="btn-primary w-full mb-4 disabled:opacity-50"
          >
            {isPending || isConfirming ? 'Claiming...' :
             claimStep === 'base' ? 'Claim Base Rewards (Step 1)' :
             'Claim Celo Rewards (Step 2)'}
          </button>
          <p className="text-xs text-gray-500 text-center">
            {claimStep === 'base' ?
              'You will be prompted to switch to Base network' :
              'You will be prompted to switch to Celo network'}
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-bold text-center">
              ✅ All Rewards Claimed Successfully!
            </p>
            <p className="text-green-600 text-sm text-center mt-1">
              Received rewards on both Base and Celo networks
            </p>
          </div>

          <button
            onClick={onShare}
            className="btn-primary w-full mb-3"
          >
            Share Your Win on Farcaster 🎉
          </button>

          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Play Another Round
          </button>
        </div>
      )}
    </div>
  );
}
