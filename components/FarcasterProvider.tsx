'use client';

import { ReactNode, useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        // Wait for the app to be fully loaded
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Call ready to hide splash screen
        await sdk.actions.ready();
        setIsReady(true);

        console.log('Farcaster SDK initialized');
        console.log('Context:', sdk.context);
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        // Still set ready to show app even if SDK fails
        setIsReady(true);
      }
    };

    initFarcaster();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-brown font-medium">Loading game...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
