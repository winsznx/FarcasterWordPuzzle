import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { getTalentScoreByFID, calculateBonusMultiplier } from '@/lib/talent';

// In-memory store for used nonces (use Redis in production)
const usedNonces = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { level, answer, puzzle, fid } = await request.json();

    // Validate answer
    if (answer.toUpperCase() !== puzzle.toUpperCase()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect answer' },
        { status: 400 }
      );
    }

    // Generate signature
    const privateKey = process.env.BACKEND_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Backend private key not configured');
    }

    const wallet = new ethers.Wallet(privateKey);

    // Generate unique nonce
    const nonce = ethers.hexlify(ethers.randomBytes(32));

    // Check if nonce was already used
    if (usedNonces.has(nonce)) {
      return NextResponse.json(
        { success: false, error: 'Nonce already used' },
        { status: 400 }
      );
    }

    // Fetch Talent score and calculate bonus multiplier
    let bonusMultiplier = 1.0; // Default: no bonus
    if (fid) {
      const talentScore = await getTalentScoreByFID(fid);
      if (talentScore && talentScore.score > 0) {
        bonusMultiplier = calculateBonusMultiplier(talentScore.score);
      }
    }

    // Base reward amounts per WIN
    const baseToken1Amount = 10; // 10 PUZZ (on Base)
    const baseToken2Amount = 10; // 10 RWRD (on Celo)

    // Apply Talent bonus to custom tokens only
    const token1Amount = ethers.parseUnits((baseToken1Amount * bonusMultiplier).toString(), 18);
    const token2Amount = ethers.parseUnits((baseToken2Amount * bonusMultiplier).toString(), 18);

    // WCT and CELO are NOT affected by Talent bonus
    const wctAmount = ethers.parseUnits('0.1', 18); // 0.1 WCT (on Base)
    const celoAmount = ethers.parseUnits('0.05', 18); // 0.05 CELO (on Celo)

    const timestamp = Math.floor(Date.now() / 1000);
    const baseNonce = ethers.hexlify(ethers.randomBytes(32));
    const celoNonce = ethers.hexlify(ethers.randomBytes(32));

    // Check if nonces were already used
    if (usedNonces.has(baseNonce) || usedNonces.has(celoNonce)) {
      return NextResponse.json(
        { success: false, error: 'Nonce already used' },
        { status: 400 }
      );
    }

    // === BASE CHAIN SIGNATURE (Token1 + WCT) ===
    const baseMessageHash = ethers.solidityPackedKeccak256(
      ['uint256', 'uint256', 'bytes32', 'uint256'],
      [token1Amount, wctAmount, baseNonce, timestamp]
    );

    const baseSignature = await wallet.signMessage(ethers.getBytes(baseMessageHash));
    const baseSig = ethers.Signature.from(baseSignature);

    const baseDatabytes = ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256', 'uint256', 'bytes32', 'uint256'],
      [token1Amount, wctAmount, baseNonce, timestamp]
    );

    // === CELO CHAIN SIGNATURE (Token2 + CELO) ===
    const celoMessageHash = ethers.solidityPackedKeccak256(
      ['uint256', 'uint256', 'bytes32', 'uint256'],
      [token2Amount, celoAmount, celoNonce, timestamp]
    );

    const celoSignature = await wallet.signMessage(ethers.getBytes(celoMessageHash));
    const celoSig = ethers.Signature.from(celoSignature);

    const celoDatabytes = ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256', 'uint256', 'bytes32', 'uint256'],
      [token2Amount, celoAmount, celoNonce, timestamp]
    );

    // Store nonces as used
    usedNonces.add(baseNonce);
    usedNonces.add(celoNonce);

    return NextResponse.json({
      success: true,
      bonusMultiplier,
      rewards: {
        puzz: baseToken1Amount * bonusMultiplier,
        rwrd: baseToken2Amount * bonusMultiplier,
        wct: 0.1,
        celo: 0.05,
      },
      signature: {
        base: {
          databytes: baseDatabytes,
          v: baseSig.v,
          r: baseSig.r,
          s: baseSig.s,
        },
        celo: {
          databytes: celoDatabytes,
          v: celoSig.v,
          r: celoSig.r,
          s: celoSig.s,
        },
      },
    });
  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
