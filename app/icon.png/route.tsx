import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#e35336',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f5f5dc',
        }}
      >
        <div style={{ fontSize: 200 }}>🧩</div>
        <div style={{ fontSize: 48, fontWeight: 'bold', marginTop: 20 }}>PUZZLE</div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    },
  );
}
