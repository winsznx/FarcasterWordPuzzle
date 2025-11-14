'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import sdk from '@farcaster/miniapp-sdk';
import axios from 'axios';

interface LeaderboardEntry {
  fid: number;
  score: number;
  rank?: number;
  bonusMultiplier: number;
  bonusDescription: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserFid, setCurrentUserFid] = useState<number | null>(null);

  useEffect(() => {
    // Get current user's FID
    const loadContext = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setCurrentUserFid(context.user.fid);
        }
      } catch (error) {
        console.error('Error getting Farcaster context:', error);
      }
    };

    loadContext();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // In a real app, you'd fetch actual player FIDs from your game database
      // For now, we'll use sample FIDs - replace with actual game participants
      const sampleFids = [1, 2, 3, 602, 3621, 6806, 99, 194, 239];

      const response = await axios.post('/api/talent/leaderboard', {
        fids: sampleFids,
      });

      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getBonusColor = (multiplier: number) => {
    if (multiplier >= 2.0) return 'text-orange-600 bg-orange-50';
    if (multiplier >= 1.5) return 'text-yellow-600 bg-yellow-50';
    if (multiplier >= 1.2) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-brand-tan transition-colors"
          >
            ← Back to Game
          </button>
          <button
            onClick={() => router.push('/talent')}
            className="text-white hover:text-brand-tan transition-colors"
          >
            My Profile →
          </button>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold mb-2">Talent Leaderboard</h1>
            <p className="text-purple-100">Top builders playing Word Puzzle</p>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-2">
                🎁 Higher Talent scores earn bonus rewards on every win!
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  🔥 Score ≥80: 2x bonus
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  ⭐ Score ≥60: 1.5x bonus
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  ✨ Score ≥40: 1.2x bonus
                </span>
              </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="p-6">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No Players Yet
                </h2>
                <p className="text-gray-600">
                  Be the first to play and claim your spot!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.fid}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      entry.fid === currentUserFid
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl font-bold min-w-[60px] text-center">
                        {getMedalEmoji(index)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            FID: {entry.fid}
                          </span>
                          {entry.fid === currentUserFid && (
                            <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        {entry.rank && (
                          <div className="text-xs text-gray-500 mt-1">
                            Global Rank: #{entry.rank}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      <div className="text-center min-w-[100px]">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          {entry.score}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>

                      {/* Bonus */}
                      <div className={`min-w-[120px] text-center rounded-lg px-3 py-2 ${getBonusColor(entry.bonusMultiplier)}`}>
                        <div className="text-lg font-bold">
                          {entry.bonusMultiplier}x
                        </div>
                        <div className="text-xs">Bonus</div>
                      </div>

                      {/* Potential Rewards */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-semibold text-gray-800">
                          {10 * entry.bonusMultiplier} PUZZ
                        </div>
                        <div className="text-xs text-gray-500">per win</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 p-6 border-t">
            <div className="text-center text-sm text-gray-600 mb-4">
              <p className="mb-2">
                Everyone can play regardless of Talent score!
              </p>
              <p className="text-xs">
                Don't have a Talent score? Build your profile at{' '}
                <a
                  href="https://www.talentprotocol.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  talentprotocol.com
                </a>
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full max-w-xs mx-auto block"
            >
              Start Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
