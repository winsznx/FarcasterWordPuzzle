import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #e35336 0%, #a0522d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f5f5dc',
        }}
      >
        <div style={{ fontSize: 220 }}>🧩</div>
        <div style={{ fontSize: 80, fontWeight: 'bold', marginTop: 20 }}>
          Word Puzzle Game
        </div>
        <div style={{ fontSize: 38, marginTop: 15, opacity: 0.9 }}>
          Play • Win • Earn Crypto
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
