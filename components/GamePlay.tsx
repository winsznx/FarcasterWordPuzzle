'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { GAME_CONTRACT_ADDRESS, GAME_ABI } from '@/lib/contracts';
import { RewardClaim } from './RewardClaim';
import sdk from '@farcaster/miniapp-sdk';

interface GamePlayProps {
  level: 1 | 2;
  onBack: () => void;
}

interface Puzzle {
  word: string;
  clue: string;
  scrambled: string;
}

const LEVEL_1_PUZZLES: Puzzle[] = [
  { word: 'CRYPTO', clue: 'Digital currency', scrambled: 'TPYCRO' },
  { word: 'BLOCKCHAIN', clue: 'Distributed ledger technology', scrambled: 'KCNIHCOLBA' },
  { word: 'WALLET', clue: 'Where you store your coins', scrambled: 'LLAEWT' },
  { word: 'TOKEN', clue: 'Digital asset on a blockchain', scrambled: 'NETOK' },
  { word: 'SMART', clue: 'Type of self-executing contract', scrambled: 'TMARS' },
];

const LEVEL_2_PUZZLES: Puzzle[] = [
  { word: 'DECENTRALIZED', clue: 'Not controlled by a single entity', scrambled: 'DEECIZTDERNAL' },
  { word: 'CONSENSUS', clue: 'Agreement mechanism in blockchain', scrambled: 'SSUNENOSC' },
  { word: 'VALIDATOR', clue: 'Node that validates transactions', scrambled: 'DTLAIAORV' },
  { word: 'PROTOCOL', clue: 'Set of rules for blockchain', scrambled: 'LOOTRPOC' },
  { word: 'STAKING', clue: 'Locking tokens for rewards', scrambled: 'GKNSAIT' },
];

export function GamePlay({ level, onBack }: GamePlayProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [signature, setSignature] = useState<any>(null);
  const [showReward, setShowReward] = useState(false);
  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1.0);
  const [rewards, setRewards] = useState<any>(null);
  const [fid, setFid] = useState<number | null>(null);

  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess: playTxSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    // Get Farcaster FID for Talent bonus
    const loadContext = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setFid(context.user.fid);
        }
      } catch (error) {
        console.error('Error getting Farcaster context:', error);
      }
    };

    loadContext();
  }, []);

  useEffect(() => {
    if (playTxSuccess && gameState === 'idle') {
      // Start game after payment confirmed
      loadNewPuzzle();
      setGameState('playing');

      // Track play stat
      if (address) {
        fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, action: 'play', level }),
        }).catch(err => console.error('Stats tracking error:', err));
      }
    }
  }, [playTxSuccess, gameState, address, level]);

  const loadNewPuzzle = () => {
    const puzzles = level === 1 ? LEVEL_1_PUZZLES : LEVEL_2_PUZZLES;
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setPuzzle(randomPuzzle);
    setUserAnswer('');
  };

  const handleStartGame = () => {
    writeContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: GAME_ABI,
      functionName: 'play',
      args: [BigInt(level)],
      value: parseEther('0.0000001'),
    });
  };

  const handleSubmit = async () => {
    if (!puzzle) return;

    if (userAnswer.toUpperCase() === puzzle.word) {
      setGameState('won');

      // Track win stat
      if (address) {
        fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, action: 'win', level }),
        }).catch(err => console.error('Stats tracking error:', err));
      }

      // Call backend to get signature
      try {
        const response = await fetch('/api/game/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            answer: userAnswer,
            puzzle: puzzle.word,
            fid, // Pass FID for Talent bonus calculation
          }),
        });

        const data = await response.json();

        if (data.success && data.signature) {
          setSignature(data.signature);
          setBonusMultiplier(data.bonusMultiplier || 1.0);
          setRewards(data.rewards);
          setShowReward(true);
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    } else {
      setGameState('lost');
    }
  };

  const handlePlayAgain = () => {
    setGameState('idle');
    setUserAnswer('');
    setSignature(null);
    setShowReward(false);
    setPuzzle(null);
  };

  const handleShareWin = async () => {
    try {
      await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          `🎮 Just solved a Level ${level} word puzzle and earned crypto rewards! Join me on Word Puzzle Game 🧩\n\n${process.env.NEXT_PUBLIC_APP_URL}`
        )}`
      );
    } catch (error) {
      console.error('Error opening cast:', error);
    }
  };

  if (showReward && signature) {
    return (
      <RewardClaim
        signature={signature}
        onClose={() => {
          setShowReward(false);
          handlePlayAgain();
        }}
        onShare={handleShareWin}
      />
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-orange">
          Level {level} Puzzle
        </h2>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-brand-orange font-medium"
        >
          ← Back
        </button>
      </div>

      {gameState === 'idle' && (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-orange to-brand-tan rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-white">{level}</span>
            </div>
            <h3 className="text-xl font-bold text-brand-brown mb-2">
              Ready to Play?
            </h3>
            <p className="text-gray-600 mb-4">
              Pay 0.0000001 ETH to start a new puzzle
            </p>
          </div>
          <button
            onClick={handleStartGame}
            disabled={isPending}
            className="btn-primary disabled:opacity-50"
          >
            {isPending ? 'Processing Payment...' : 'Start Game (0.0000001 ETH)'}
          </button>
        </div>
      )}

      {gameState === 'playing' && puzzle && (
        <div className="space-y-6">
          <div className="bg-brand-tan bg-opacity-20 p-6 rounded-lg border-2 border-brand-tan">
            <p className="text-sm text-brand-brown font-medium mb-2">Clue:</p>
            <p className="text-xl font-bold text-gray-800">{puzzle.clue}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-brand-orange">
            <p className="text-sm text-brand-brown font-medium mb-3">Scrambled Letters:</p>
            <div className="flex justify-center gap-2 mb-4">
              {puzzle.scrambled.split('').map((letter, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-brand-orange text-white text-2xl font-bold flex items-center justify-center rounded-lg"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-brown mb-2">
              Your Answer:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
              className="input-field"
              placeholder="Enter the word..."
              maxLength={puzzle.word.length}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="btn-primary w-full disabled:opacity-50"
          >
            Submit Answer
          </button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl">🎉</span>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Congratulations!
          </h3>
          <p className="text-gray-600 mb-2">
            You solved the puzzle correctly!
          </p>

          {bonusMultiplier > 1.0 && rewards && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <p className="text-sm font-semibold text-orange-700 mb-2">
                🔥 Talent Bonus: {bonusMultiplier}x
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white rounded px-2 py-1">
                  <span className="font-bold text-blue-600">{rewards.puzz}</span> PUZZ
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="font-bold text-green-600">{rewards.rwrd}</span> RWRD
                </div>
              </div>
            </div>
          )}

          {!showReward && (
            <p className="text-brand-orange font-medium">
              Claiming your rewards...
            </p>
          )}
        </div>
      )}

      {gameState === 'lost' && (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl">😞</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            Wrong Answer!
          </h3>
          <p className="text-gray-600 mb-2">
            The correct answer was: <strong>{puzzle?.word}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Better luck next time!
          </p>
          <button onClick={handlePlayAgain} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
