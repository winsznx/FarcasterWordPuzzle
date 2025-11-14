import { NextRequest, NextResponse } from 'next/server';
import { getTalentScoreByFID, calculateBonusMultiplier, getBonusDescription } from '@/lib/talent';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { error: 'Farcaster FID is required' },
        { status: 400 }
      );
    }

    const fidNumber = parseInt(fid, 10);
    if (isNaN(fidNumber)) {
      return NextResponse.json(
        { error: 'Invalid FID format' },
        { status: 400 }
      );
    }

    const talentScore = await getTalentScoreByFID(fidNumber);

    if (!talentScore) {
      // User doesn't have a Talent score - that's okay, they can still play
      return NextResponse.json({
        fid: fidNumber,
        score: 0,
        hasScore: false,
        bonusMultiplier: 1.0,
        bonusDescription: 'Standard Rewards',
      });
    }

    const bonusMultiplier = calculateBonusMultiplier(talentScore.score);
    const bonusDescription = getBonusDescription(talentScore.score);

    return NextResponse.json({
      fid: fidNumber,
      score: talentScore.score,
      rank: talentScore.rank,
      hasScore: true,
      bonusMultiplier,
      bonusDescription,
      walletAddresses: talentScore.identity_graph?.wallet_addresses || [],
      ensNames: talentScore.identity_graph?.ens_names || [],
    });
  } catch (error) {
    console.error('Error in Talent score API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Talent score' },
      { status: 500 }
    );
  }
}
