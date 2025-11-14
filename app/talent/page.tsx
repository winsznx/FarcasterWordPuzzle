'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import sdk from '@farcaster/miniapp-sdk';
import axios from 'axios';

interface TalentData {
  fid: number;
  score: number;
  rank?: number;
  hasScore: boolean;
  bonusMultiplier: number;
  bonusDescription: string;
  walletAddresses?: string[];
  ensNames?: string[];
}

export default function TalentPage() {
  const router = useRouter();
  const [talentData, setTalentData] = useState<TalentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fid, setFid] = useState<number | null>(null);

  useEffect(() => {
    // Get Farcaster user context
    const loadContext = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setFid(context.user.fid);
          fetchTalentScore(context.user.fid);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting Farcaster context:', error);
        setLoading(false);
      }
    };

    loadContext();
  }, []);

  const fetchTalentScore = async (userFid: number) => {
    try {
      const response = await axios.get(`/api/talent/score?fid=${userFid}`);
      setTalentData(response.data);
    } catch (error) {
      console.error('Error fetching Talent score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (!fid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange p-6">
        <div className="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Open in Farcaster
          </h1>
          <p className="text-gray-600 mb-6">
            This feature is only available when using the app within Farcaster.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary w-full"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-brand-tan transition-colors"
          >
            ← Back to Game
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-white hover:text-brand-tan transition-colors"
          >
            Leaderboard →
          </button>
        </div>

        {/* Talent Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold mb-2">Your Talent Profile</h1>
            <p className="text-purple-100">Farcaster FID: {fid}</p>
          </div>

          {/* Score Section */}
          <div className="p-8">
            {talentData?.hasScore ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-8 py-4 mb-4">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {talentData.score}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Builder Score</div>
                  </div>
                  {talentData.rank && (
                    <p className="text-gray-600">
                      Rank: <span className="font-semibold">#{talentData.rank}</span>
                    </p>
                  )}
                </div>

                {/* Bonus Multiplier */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        Reward Bonus
                      </h3>
                      <p className="text-sm text-gray-600">
                        Applied to all game wins
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {talentData.bonusMultiplier}x
                      </div>
                      <div className="text-xs text-gray-600">
                        {talentData.bonusDescription}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reward Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {10 * talentData.bonusMultiplier}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">PUZZ per win</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {10 * talentData.bonusMultiplier}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">RWRD per win</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      0.1
                    </div>
                    <div className="text-xs text-gray-600 mt-1">WCT per win</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">
                      0.05
                    </div>
                    <div className="text-xs text-gray-600 mt-1">CELO per win</div>
                  </div>
                </div>

                {/* Bonus Tiers */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Bonus Tiers</h3>
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-3 rounded-lg ${talentData.score >= 80 ? 'bg-orange-100 border-2 border-orange-400' : 'bg-white'}`}>
                      <span className="text-sm">🔥 Elite Builder</span>
                      <span className="font-bold">2x (Score ≥ 80)</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${talentData.score >= 60 && talentData.score < 80 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white'}`}>
                      <span className="text-sm">⭐ Top Builder</span>
                      <span className="font-bold">1.5x (Score ≥ 60)</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${talentData.score >= 40 && talentData.score < 60 ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white'}`}>
                      <span className="text-sm">✨ Rising Builder</span>
                      <span className="font-bold">1.2x (Score ≥ 40)</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${talentData.score < 40 ? 'bg-gray-100 border-2 border-gray-400' : 'bg-white'}`}>
                      <span className="text-sm">🎮 Standard</span>
                      <span className="font-bold">1x (Score &lt; 40)</span>
                    </div>
                  </div>
                </div>

                {/* Identity Info */}
                {(talentData.ensNames && talentData.ensNames.length > 0) && (
                  <div className="mt-6 bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">ENS Names</h4>
                    <div className="space-y-1">
                      {talentData.ensNames.map((ens, idx) => (
                        <div key={idx} className="text-sm text-purple-700">
                          {ens}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  No Talent Score Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  You don't have a Talent Protocol score yet, but you can still play and earn standard rewards!
                </p>
                <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-sm text-gray-700 mb-4">
                    Build your profile on Talent Protocol to unlock bonus rewards:
                  </p>
                  <a
                    href="https://www.talentprotocol.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visit Talent Protocol
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full max-w-xs"
            >
              Start Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
