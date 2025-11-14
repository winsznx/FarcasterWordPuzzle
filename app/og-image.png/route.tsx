import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #e35336 0%, #f4a460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f5f5dc',
          padding: 40,
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 30 }}>🧩</div>
        <div style={{ fontSize: 72, fontWeight: 'bold', textAlign: 'center' }}>
          Word Puzzle Game
        </div>
        <div style={{ fontSize: 40, marginTop: 20, textAlign: 'center', opacity: 0.9 }}>
          Solve Puzzles • Earn Crypto Rewards
        </div>
        <div style={{ fontSize: 32, marginTop: 30, textAlign: 'center', opacity: 0.8 }}>
          Multi-chain rewards on Base & Celo
        </div>
        <div style={{
          fontSize: 28,
          marginTop: 20,
          padding: '10px 30px',
          background: '#ffffff30',
          borderRadius: 20,
          fontWeight: 'bold'
        }}>
          🔥 Talent Protocol Bonus up to 2x!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
