import axios from 'axios';

const TALENT_API_BASE = 'https://api.talentprotocol.com';
const API_KEY = process.env.TALENT_PROTOCOL_API_KEY || '';

export interface TalentScore {
  fid: number;
  score: number;
  rank?: number;
  identity_graph?: {
    wallet_addresses?: string[];
    ens_names?: string[];
  };
}

export interface BuilderProfile {
  id: string;
  name: string;
  bio?: string;
  image_url?: string;
  verified?: boolean;
  tags?: string[];
  score?: number;
  location?: string;
  skills?: string[];
  github_url?: string;
  twitter_url?: string;
  farcaster_fid?: number;
}

/**
 * Fetch Talent Builder Score by Farcaster FID
 */
export async function getTalentScoreByFID(fid: number): Promise<TalentScore | null> {
  try {
    const response = await axios.get(`${TALENT_API_BASE}/farcaster/scores`, {
      params: { fids: fid },
      headers: {
        'X-API-KEY': API_KEY,
      },
    });

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching Talent score:', error);
    return null;
  }
}

/**
 * Fetch multiple Talent Builder Scores by FIDs
 */
export async function getTalentScoresByFIDs(fids: number[]): Promise<TalentScore[]> {
  try {
    const response = await axios.get(`${TALENT_API_BASE}/farcaster/scores`, {
      params: { fids: fids.join(',') },
      headers: {
        'X-API-KEY': API_KEY,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching Talent scores:', error);
    return [];
  }
}

/**
 * Get builder profile by Talent ID
 */
export async function getBuilderProfile(talentId: string): Promise<BuilderProfile | null> {
  try {
    const response = await axios.get(`${TALENT_API_BASE}/api/v2/passports/${talentId}`, {
      headers: {
        'X-API-KEY': API_KEY,
      },
    });

    return response.data.passport || null;
  } catch (error) {
    console.error('Error fetching builder profile:', error);
    return null;
  }
}

/**
 * Calculate bonus multiplier based on Talent score
 * - Score >= 80: 2x bonus (20 tokens instead of 10)
 * - Score >= 60: 1.5x bonus (15 tokens instead of 10)
 * - Score >= 40: 1.2x bonus (12 tokens instead of 10)
 * - Score < 40: No bonus (10 tokens)
 */
export function calculateBonusMultiplier(score: number): number {
  if (score >= 80) return 2.0;
  if (score >= 60) return 1.5;
  if (score >= 40) return 1.2;
  return 1.0;
}

/**
 * Get bonus description text
 */
export function getBonusDescription(score: number): string {
  if (score >= 80) return '🔥 2x Bonus (Elite Builder)';
  if (score >= 60) return '⭐ 1.5x Bonus (Top Builder)';
  if (score >= 40) return '✨ 1.2x Bonus (Rising Builder)';
  return 'Standard Rewards';
}

/**
 * Check if score qualifies for any bonus
 */
export function hasBonus(score: number): boolean {
  return score >= 40;
}
