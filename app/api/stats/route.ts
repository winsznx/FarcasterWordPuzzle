import { NextRequest, NextResponse } from 'next/server';

// Mock database (use real database in production)
const playerStats = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter required' },
        { status: 400 }
      );
    }

    // Get stats or return defaults
    const stats = playerStats.get(address.toLowerCase()) || {
      totalWins: 0,
      totalPlays: 0,
      rewardsClaimed: 0,
      level1Plays: 0,
      level2Plays: 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { address, action, level } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Address required' },
        { status: 400 }
      );
    }

    const key = address.toLowerCase();
    const stats = playerStats.get(key) || {
      totalWins: 0,
      totalPlays: 0,
      rewardsClaimed: 0,
      level1Plays: 0,
      level2Plays: 0,
    };

    // Update stats based on action
    if (action === 'play') {
      stats.totalPlays += 1;
      if (level === 1) stats.level1Plays += 1;
      if (level === 2) stats.level2Plays += 1;
    } else if (action === 'win') {
      stats.totalWins += 1;
    } else if (action === 'claim') {
      stats.rewardsClaimed += 1;
    }

    playerStats.set(key, stats);

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
