import { NextRequest, NextResponse } from 'next/server';
import { getTalentScoresByFIDs, calculateBonusMultiplier, getBonusDescription } from '@/lib/talent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fids } = body;

    if (!fids || !Array.isArray(fids)) {
      return NextResponse.json(
        { error: 'FIDs array is required' },
        { status: 400 }
      );
    }

    const scores = await getTalentScoresByFIDs(fids);

    const leaderboard = scores
      .map(score => ({
        fid: score.fid,
        score: score.score,
        rank: score.rank,
        bonusMultiplier: calculateBonusMultiplier(score.score),
        bonusDescription: getBonusDescription(score.score),
      }))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      leaderboard,
      total: leaderboard.length,
    });
  } catch (error) {
    console.error('Error in Talent leaderboard API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
