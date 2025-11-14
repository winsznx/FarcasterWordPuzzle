import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, celo } from '@reown/appkit/networks';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';

// Get project ID from environment
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_REOWN_PROJECT_ID is not set');
}

// Set up Reown AppKit metadata
const metadata = {
  name: 'Word Puzzle Game',
  description: 'NFT-gated word puzzle game with crypto rewards',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com',
  icons: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/icon.png`]
};

// Create wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [base, celo],
  projectId,
  ssr: true
});

// Create AppKit instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, celo],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#e35336', // brand orange
    '--w3m-border-radius-master': '8px',
  }
});

// Export wagmi config with Farcaster connector added
export const config = wagmiAdapter.wagmiConfig;
