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
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <div className="bg-brand-tan text-white px-3 py-2 rounded-lg font-medium text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <span className="sm:hidden">{address?.slice(0, 4)}...{address?.slice(-3)}</span>
            {chain && (
              <span className="text-xs opacity-80 hidden md:inline">
                {chain.name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm w-full sm:w-auto"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      {isFarcaster && (
        <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
          🎮 In Farcaster
        </div>
      )}
      <button
        onClick={() => open()}
        className="btn-primary w-full sm:w-auto text-sm"
      >
        Connect Wallet
      </button>
    </div>
  );
}
