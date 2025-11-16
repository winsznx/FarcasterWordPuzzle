import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Word Puzzle - Farcaster Mini App',
  description: 'NFT-gated word puzzle game with multi-chain crypto rewards on Base and Celo. Solve crypto-themed word puzzles and earn tokens!',
  applicationName: 'Word Puzzle',
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      name: 'Word Puzzle',
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
      button: {
        title: 'Play Game',
        action: {
          type: 'launch_frame',
          name: 'Word Puzzle',
          url: process.env.NEXT_PUBLIC_APP_URL,
          splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
          splashBackgroundColor: '#f5f5dc',
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
