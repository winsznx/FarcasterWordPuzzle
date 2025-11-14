'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

interface PlayerStatsData {
  totalWins: number;
  totalPlays: number;
  rewardsClaimed: number;
  level1Plays: number;
  level2Plays: number;
}

export function PlayerStats() {
  const { address } = useAccount();
  const [stats, setStats] = useState<PlayerStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/stats?address=${address}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchStats();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const winRate = stats && stats.totalPlays > 0
    ? ((stats.totalWins / stats.totalPlays) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-brand-orange mb-6">
          Player Statistics
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Total Wins */}
          <div className="bg-gradient-to-br from-brand-orange to-brand-tan p-6 rounded-lg text-white">
            <p className="text-sm font-medium opacity-90 mb-1">Total Wins</p>
            <p className="text-4xl font-bold">{stats?.totalWins || 0}</p>
          </div>

          {/* Total Plays */}
          <div className="bg-gradient-to-br from-brand-tan to-brand-brown p-6 rounded-lg text-white">
            <p className="text-sm font-medium opacity-90 mb-1">Total Plays</p>
            <p className="text-4xl font-bold">{stats?.totalPlays || 0}</p>
          </div>

          {/* Win Rate */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-lg text-white">
            <p className="text-sm font-medium opacity-90 mb-1">Win Rate</p>
            <p className="text-4xl font-bold">{winRate}%</p>
          </div>

          {/* Rewards Claimed */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-lg text-white">
            <p className="text-sm font-medium opacity-90 mb-1">Rewards Claimed</p>
            <p className="text-4xl font-bold">{stats?.rewardsClaimed || 0}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-brand-orange mb-4">
          Level Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Level 1 Plays</span>
            <span className="text-2xl font-bold text-brand-orange">
              {stats?.level1Plays || 0}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Level 2 Plays</span>
            <span className="text-2xl font-bold text-brand-orange">
              {stats?.level2Plays || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-brand-cream to-white">
        <h3 className="text-lg font-bold text-brand-brown mb-2">
          Keep Playing!
        </h3>
        <p className="text-gray-600 text-sm">
          Each win earns you approximately $0.05 in various crypto tokens. Keep solving puzzles to maximize your rewards!
        </p>
      </div>
    </div>
  );
}
