'use client';

import { ReactNode, useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        // Call ready immediately to hide splash screen
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
    return null; // Let splash screen show while initializing
  }

  return <>{children}</>;
}
