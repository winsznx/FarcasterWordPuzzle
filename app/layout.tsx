import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://farcaster-word-puzzle.vercel.app';

export const metadata: Metadata = {
  title: 'Word Puzzle - Farcaster Mini App',
  description: 'NFT-gated word puzzle game with multi-chain crypto rewards on Base and Celo. Solve crypto-themed word puzzles and earn tokens!',
  applicationName: 'Word Puzzle',
  openGraph: {
    title: 'Word Puzzle Game',
    description: 'Solve puzzles, earn crypto rewards on Base and Celo!',
    images: [`${APP_URL}/icon.png`],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: `${APP_URL}/icon.png`,
      button: {
        title: 'Play Game',
        action: {
          type: 'launch_frame',
          name: 'Word Puzzle',
          url: APP_URL,
          splashImageUrl: `${APP_URL}/icon.png`,
          splashBackgroundColor: '#e35336',
        },
      },
    }),
    // For backward compatibility
    'fc:frame': JSON.stringify({
      version: '1',
      imageUrl: `${APP_URL}/icon.png`,
      button: {
        title: 'Play Game',
        action: {
          type: 'launch_frame',
          name: 'Word Puzzle',
          url: APP_URL,
          splashImageUrl: `${APP_URL}/icon.png`,
          splashBackgroundColor: '#e35336',
        },
      },
    }),
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
