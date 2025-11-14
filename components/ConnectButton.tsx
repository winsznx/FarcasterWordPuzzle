'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';
import sdk from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';

export function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [isFarcaster, setIsFarcaster] = useState(false);

  useEffect(() => {
    // Check if running inside Farcaster
    const loadContext = async () => {
      try {
        const context = await sdk.context;
        setIsFarcaster(!!context?.user);
      } catch {
        setIsFarcaster(false);
      }
    };

    loadContext();
  }, []);

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-brand-tan text-white px-4 py-2 rounded-lg font-medium text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            {chain && (
              <span className="text-xs opacity-80">
                {chain.name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isFarcaster && (
        <div className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
          🎮 In Farcaster
        </div>
      )}
      <button
        onClick={() => open()}
        className="btn-primary"
      >
        Connect Wallet
      </button>
    </div>
  );
}
