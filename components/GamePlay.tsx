'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { GAME_CONTRACT_ADDRESS, GAME_ABI } from '@/lib/contracts';
import { RewardClaim } from './RewardClaim';
import { sdk } from '@farcaster/miniapp-sdk';
import { Timer, PartyPopper, Flame, Frown, Clock } from 'lucide-react';

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
  { word: 'WALLET', clue: 'Where you store coins', scrambled: 'LLAEWT' },
  { word: 'TOKEN', clue: 'Digital asset', scrambled: 'NETOK' },
  { word: 'SMART', clue: 'Contract type', scrambled: 'TMARS' },
  { word: 'MINING', clue: 'Creating new blocks', scrambled: 'GINIMN' },
  { word: 'CHAIN', clue: 'Linked blocks', scrambled: 'NAHCI' },
  { word: 'LEDGER', clue: 'Transaction record', scrambled: 'REGDEL' },
  { word: 'NODES', clue: 'Network computers', scrambled: 'SNEDO' },
  { word: 'BLOCK', clue: 'Data container', scrambled: 'KOLBC' },
  { word: 'PROOF', clue: 'Validation method', scrambled: 'FORPO' },
  { word: 'HASH', clue: 'Cryptographic output', scrambled: 'SAHA' },
  { word: 'PEERS', clue: 'Network participants', scrambled: 'SREEP' },
  { word: 'FORK', clue: 'Chain split', scrambled: 'KORF' },
  { word: 'GAS', clue: 'Transaction fee', scrambled: 'SGA' },
  { word: 'SWAP', clue: 'Token exchange', scrambled: 'PAWS' },
  { word: 'MINT', clue: 'Create tokens', scrambled: 'TNIM' },
  { word: 'BURN', clue: 'Destroy tokens', scrambled: 'NRUB' },
  { word: 'KEYS', clue: 'Access credentials', scrambled: 'SYKE' },
  { word: 'SEED', clue: 'Wallet backup phrase', scrambled: 'DEES' },
  { word: 'SHARD', clue: 'Blockchain partition', scrambled: 'DRASH' },
  { word: 'STAKE', clue: 'Lock tokens', scrambled: 'KETAS' },
  { word: 'ORACLE', clue: 'External data source', scrambled: 'ERALCO' },
  { word: 'BRIDGE', clue: 'Cross-chain connector', scrambled: 'EGDIRB' },
  { word: 'WHALE', clue: 'Large holder', scrambled: 'LEHAW' },
  { word: 'PUMP', clue: 'Price increase', scrambled: 'MPUP' },
  { word: 'DUMP', clue: 'Price decrease', scrambled: 'MPUD' },
  { word: 'BULL', clue: 'Market optimism', scrambled: 'LLUB' },
  { word: 'BEAR', clue: 'Market pessimism', scrambled: 'RAEB' },
  { word: 'MOON', clue: 'Price surge', scrambled: 'NOMO' },
  { word: 'HODL', clue: 'Hold strategy', scrambled: 'LDOH' },
  { word: 'FOMO', clue: 'Fear of missing out', scrambled: 'OMFO' },
  { word: 'FUD', clue: 'Fear uncertainty doubt', scrambled: 'DUF' },
  { word: 'FLASH', clue: 'Quick loan type', scrambled: 'HSALF' },
  { word: 'POOL', clue: 'Liquidity collection', scrambled: 'LOOP' },
  { word: 'FARM', clue: 'Yield generation', scrambled: 'MRAF' },
  { word: 'VAULT', clue: 'Secured storage', scrambled: 'TLUAV' },
  { word: 'REKT', clue: 'Total loss', scrambled: 'TKER' },
  { word: 'GWEI', clue: 'Gas unit', scrambled: 'WEIG' },
  { word: 'WEI', clue: 'Smallest ETH unit', scrambled: 'IEW' },
  { word: 'ETHER', clue: 'Ethereum currency', scrambled: 'REHTE' },
  { word: 'LAYER', clue: 'Scaling solution', scrambled: 'REYAL' },
  { word: 'SIDECHAIN', clue: 'Parallel blockchain', scrambled: 'EDICHAINS' },
  { word: 'MERKLE', clue: 'Tree structure', scrambled: 'ELRKME' },
  { word: 'NONCE', clue: 'Number used once', scrambled: 'ECNON' },
  { word: 'SLIPPAGE', clue: 'Price difference', scrambled: 'EGAPPILS' },
  { word: 'LIQUIDITY', clue: 'Market depth', scrambled: 'YTIDIUQIL' },
  { word: 'YIELD', clue: 'Return rate', scrambled: 'DLEIY' },
  { word: 'APY', clue: 'Annual percentage yield', scrambled: 'YPA' },
  { word: 'APR', clue: 'Annual percentage rate', scrambled: 'RPA' },
  { word: 'TVL', clue: 'Total value locked', scrambled: 'LVT' },
  { word: 'DAO', clue: 'Decentralized organization', scrambled: 'OAD' },
  { word: 'NFT', clue: 'Non-fungible token', scrambled: 'TFN' },
  { word: 'DAPP', clue: 'Decentralized app', scrambled: 'PPAD' },
  { word: 'DEFI', clue: 'Decentralized finance', scrambled: 'IFED' },
  { word: 'CEFI', clue: 'Centralized finance', scrambled: 'IFEC' },
  { word: 'ICO', clue: 'Initial coin offering', scrambled: 'OCI' },
  { word: 'IDO', clue: 'Initial DEX offering', scrambled: 'ODI' },
  { word: 'IEO', clue: 'Initial exchange offering', scrambled: 'OEI' },
  { word: 'AIRDROP', clue: 'Free token distribution', scrambled: 'PORDIAA' },
  { word: 'WHITELIST', clue: 'Approved participants', scrambled: 'TSILETHIW' },
  { word: 'VESTING', clue: 'Gradual token release', scrambled: 'GNITESV' },
  { word: 'AUDIT', clue: 'Security review', scrambled: 'TIDUA' },
  { word: 'RUG', clue: 'Exit scam', scrambled: 'GUR' },
  { word: 'SCAM', clue: 'Fraudulent scheme', scrambled: 'MACS' },
  { word: 'PHISHING', clue: 'Identity theft attack', scrambled: 'GNIHSIHP' },
  { word: 'PRIVATE', clue: 'Secret key type', scrambled: 'ETAVIRP' },
  { word: 'PUBLIC', clue: 'Shared key type', scrambled: 'CILBUP' },
  { word: 'MAINNET', clue: 'Production network', scrambled: 'TENNIAM' },
  { word: 'TESTNET', clue: 'Testing network', scrambled: 'TENTSET' },
  { word: 'MEMPOOL', clue: 'Transaction waiting area', scrambled: 'LOOPEMM' },
  { word: 'ORPHAN', clue: 'Abandoned block', scrambled: 'NAHPRO' },
  { word: 'HALVING', clue: 'Reward reduction', scrambled: 'GNIVLAH' },
  { word: 'GENESIS', clue: 'First block', scrambled: 'SISENEG' },
  { word: 'FINALITY', clue: 'Transaction irreversibility', scrambled: 'YTILANIF' },
  { word: 'THROUGHPUT', clue: 'Transaction speed', scrambled: 'TUPHGUORHT' },
  { word: 'LATENCY', clue: 'Network delay', scrambled: 'YCNETAL' },
  { word: 'ROLLUP', clue: 'Layer 2 solution', scrambled: 'PULLOR' },
  { word: 'PLASMA', clue: 'Scaling framework', scrambled: 'AMSALP' },
  { word: 'ZKEVM', clue: 'Zero-knowledge EVM', scrambled: 'MVEKZ' },
  { word: 'OPTIMISM', clue: 'Optimistic rollup', scrambled: 'MSIMITPO' },
  { word: 'ARBITRUM', clue: 'Layer 2 platform', scrambled: 'MURTIBRA' },
  { word: 'POLYGON', clue: 'Ethereum sidechain', scrambled: 'NOGYOLP' },
  { word: 'SOLANA', clue: 'Fast blockchain', scrambled: 'ANALOS' },
  { word: 'CARDANO', clue: 'Proof of stake chain', scrambled: 'ONADRAC' },
  { word: 'POLKADOT', clue: 'Multichain protocol', scrambled: 'TODAKLOP' },
  { word: 'COSMOS', clue: 'Internet of blockchains', scrambled: 'SOMSOC' },
  { word: 'AVALANCHE', clue: 'Consensus protocol', scrambled: 'EHCNALAVA' },
  { word: 'ALGORAND', clue: 'Pure proof of stake', scrambled: 'DNAROGLA' },
  { word: 'TEZOS', clue: 'Self-amending chain', scrambled: 'SOZET' },
  { word: 'NEAR', clue: 'Sharded blockchain', scrambled: 'RAEN' },
  { word: 'FLOW', clue: 'NFT blockchain', scrambled: 'WOLF' },
  { word: 'APTOS', clue: 'Move-based chain', scrambled: 'SOTPA' },
  { word: 'SUI', clue: 'Parallel execution chain', scrambled: 'IUS' },
  { word: 'CELESTIA', clue: 'Modular blockchain', scrambled: 'AITSELEC' },
  { word: 'INJECTIVE', clue: 'DeFi blockchain', scrambled: 'EVITCEJNI' },
  { word: 'SEI', clue: 'Trading-focused chain', scrambled: 'IES' },
  { word: 'STABLECOIN', clue: 'Pegged cryptocurrency', scrambled: 'NIOCLELBATS' },
  { word: 'ALTCOIN', clue: 'Alternative coin', scrambled: 'NIOTCLA' },
];

const LEVEL_2_PUZZLES: Puzzle[] = [
  { word: 'DECENTRALIZED', clue: 'Not controlled by one entity', scrambled: 'DEECIZTDERNAL' },
  { word: 'CONSENSUS', clue: 'Agreement mechanism', scrambled: 'SSUNENOSC' },
  { word: 'VALIDATOR', clue: 'Block validator', scrambled: 'DTLAIAORV' },
  { word: 'PROTOCOL', clue: 'Network rules', scrambled: 'LOOTRPOC' },
  { word: 'STAKING', clue: 'Locking tokens', scrambled: 'GKNSAIT' },
  { word: 'BLOCKCHAIN', clue: 'Distributed ledger', scrambled: 'KCNIHCOLBA' },
  { word: 'CRYPTOCURRENCY', clue: 'Digital currency', scrambled: 'YCCNERPURTOCRY' },
  { word: 'TRANSACTION', clue: 'Value transfer', scrambled: 'NOITCASNATR' },
  { word: 'DISTRIBUTED', clue: 'Spread across network', scrambled: 'DETUBIRTSID' },
  { word: 'IMMUTABLE', clue: 'Cannot be changed', scrambled: 'ELBATUMMI' },
  { word: 'TRANSPARENCY', clue: 'Open visibility', scrambled: 'YCNERAPSANRT' },
  { word: 'TRUSTLESS', clue: 'No intermediary needed', scrambled: 'SSELTSURT' },
  { word: 'PERMISSIONLESS', clue: 'No approval needed', scrambled: 'SSELNOISSIMREP' },
  { word: 'INTEROPERABILITY', clue: 'Cross-chain compatibility', scrambled: 'YTILIBAREPORETN' },
  { word: 'CRYPTOGRAPHY', clue: 'Encryption science', scrambled: 'YHPARGOTPYRC' },
  { word: 'ASYMMETRIC', clue: 'Two-key encryption', scrambled: 'CIRTEMMYSA' },
  { word: 'ELLIPTIC', clue: 'Curve cryptography', scrambled: 'CITPILLE' },
  { word: 'SIGNATURE', clue: 'Digital authorization', scrambled: 'ERUTANGIS' },
  { word: 'VERIFICATION', clue: 'Confirmation process', scrambled: 'NOITACIFIREV' },
  { word: 'AUTHENTICATION', clue: 'Identity proof', scrambled: 'NOITACITNEHTUA' },
  { word: 'MIDDLEWARE', clue: 'Connection software', scrambled: 'ERAWELDDIM' },
  { word: 'INFRASTRUCTURE', clue: 'Foundation layer', scrambled: 'ERUTCURTSARFNI' },
  { word: 'DECENTRALIZATION', clue: 'Power distribution', scrambled: 'NOITAZILARTNECE' },
  { word: 'TOKENOMICS', clue: 'Token economics', scrambled: 'SCIMONEKOTN' },
  { word: 'GOVERNANCE', clue: 'Decision-making system', scrambled: 'ECNANREVOG' },
  { word: 'MECHANISM', clue: 'Process system', scrambled: 'MSINAHCEM' },
  { word: 'DERIVATIVE', clue: 'Financial contract', scrambled: 'EVITAVIRED' },
  { word: 'PERPETUAL', clue: 'Ongoing contract', scrambled: 'LAUTEPREP' },
  { word: 'COLLATERAL', clue: 'Asset backing', scrambled: 'LARETALLOC' },
  { word: 'LIQUIDATION', clue: 'Forced sale', scrambled: 'NOITADIUQIL' },
  { word: 'LEVERAGE', clue: 'Borrowed trading power', scrambled: 'EGAREVEL' },
  { word: 'VOLATILITY', clue: 'Price fluctuation', scrambled: 'YTILITALO' },
  { word: 'ARBITRAGE', clue: 'Price difference profit', scrambled: 'EGARTIBAR' },
  { word: 'COMPOSABILITY', clue: 'Interoperability', scrambled: 'YTILIBASOPMO' },
  { word: 'SCALABILITY', clue: 'Growth capability', scrambled: 'YTILIBALACS' },
  { word: 'THROUGHPUT', clue: 'Processing capacity', scrambled: 'TUPHGUORHT' },
  { word: 'BANDWIDTH', clue: 'Data capacity', scrambled: 'HTDIWDNAB' },
  { word: 'CONGESTION', clue: 'Network overload', scrambled: 'NOITSEGNOC' },
  { word: 'OPTIMIZATION', clue: 'Efficiency improvement', scrambled: 'NOITAZIMITPO' },
  { word: 'AGGREGATOR', clue: 'Data collector', scrambled: 'ROTAGERGA' },
  { word: 'MIDDLEWARE', clue: 'Connecting layer', scrambled: 'ERAWELDDIM' },
  { word: 'SETTLEMENT', clue: 'Final transaction', scrambled: 'TNEMELTTES' },
  { word: 'FINALIZATION', clue: 'Completion process', scrambled: 'NOITAZILANIIF' },
  { word: 'CONFIRMATION', clue: 'Validation step', scrambled: 'NOITAMRIFNOC' },
  { word: 'PROPAGATION', clue: 'Network spread', scrambled: 'NOITAGAPORP' },
  { word: 'SYNCHRONIZATION', clue: 'State alignment', scrambled: 'NOITAZINORHCNYS' },
  { word: 'REPLICATION', clue: 'Data copying', scrambled: 'NOITACILPER' },
  { word: 'REDUNDANCY', clue: 'Backup copies', scrambled: 'YCNADNUDER' },
  { word: 'RESILIENCE', clue: 'Recovery ability', scrambled: 'ECNEILIISER' },
  { word: 'AVAILABILITY', clue: 'Uptime guarantee', scrambled: 'YTILIBALIAVA' },
  { word: 'CONSISTENCY', clue: 'Data uniformity', scrambled: 'YCNETSISNO' },
  { word: 'PARTITION', clue: 'Network division', scrambled: 'NOITITRAP' },
  { word: 'Byzantine', clue: 'Fault tolerance type', scrambled: 'ENITNAZBY' },
  { word: 'ASYNCHRONOUS', clue: 'Non-blocking process', scrambled: 'SUONORHCNYSA' },
  { word: 'DETERMINISTIC', clue: 'Predictable outcome', scrambled: 'CITSINIMRETED' },
  { word: 'PROBABILISTIC', clue: 'Chance-based', scrambled: 'CITSILIBABORP' },
  { word: 'INCENTIVIZE', clue: 'Reward motivation', scrambled: 'EZIVITNECNI' },
  { word: 'DISINCENTIVE', clue: 'Penalty deterrent', scrambled: 'EVITNECNISID' },
  { word: 'SLASHING', clue: 'Validator penalty', scrambled: 'GNIHSALS' },
  { word: 'DELEGATION', clue: 'Power assignment', scrambled: 'NOITAGELED' },
  { word: 'NOMINATION', clue: 'Validator selection', scrambled: 'NOITANIMON' },
  { word: 'ROTATION', clue: 'Validator switching', scrambled: 'NOITATSOR' },
  { word: 'CHECKPOINT', clue: 'State snapshot', scrambled: 'TNIOPHCECK' },
  { word: 'MILESTONE', clue: 'Progress marker', scrambled: 'ENOTSELIM' },
  { word: 'THRESHOLD', clue: 'Minimum requirement', scrambled: 'DLOHSERHT' },
  { word: 'QUORUM', clue: 'Minimum participants', scrambled: 'MURUOQ' },
  { word: 'SUPERMAJORITY', clue: 'Two-thirds vote', scrambled: 'YTIROJAMREPUS' },
  { word: 'PLURALITY', clue: 'Most votes', scrambled: 'YTILARUL' },
  { word: 'WEIGHTED', clue: 'Value-based voting', scrambled: 'DETHGIEW' },
  { word: 'QUADRATIC', clue: 'Squared voting', scrambled: 'CITARDAUQ' },
  { word: 'SNAPSHOT', clue: 'State capture', scrambled: 'TOHSPANS' },
  { word: 'PROPOSAL', clue: 'Governance suggestion', scrambled: 'LASOPORP' },
  { word: 'REFERENDUM', clue: 'Direct vote', scrambled: 'MUDNERFER' },
  { word: 'TREASURY', clue: 'Community funds', scrambled: 'YRUSAERT' },
  { word: 'ALLOCATION', clue: 'Resource distribution', scrambled: 'NOITACOLLA' },
  { word: 'DISTRIBUTION', clue: 'Spread method', scrambled: 'NOITUBIRTSID' },
  { word: 'EMISSION', clue: 'Token creation rate', scrambled: 'NOISSIME' },
  { word: 'INFLATION', clue: 'Supply increase', scrambled: 'NOITALFNI' },
  { word: 'DEFLATION', clue: 'Supply decrease', scrambled: 'NOITALFED' },
  { word: 'CIRCULATION', clue: 'Active supply', scrambled: 'NOITALUCRIC' },
  { word: 'MARKETCAP', clue: 'Total value', scrambled: 'PACTEKRAM' },
  { word: 'DOMINANCE', clue: 'Market share', scrambled: 'ECNANIMOD' },
  { word: 'CORRELATION', clue: 'Price relationship', scrambled: 'NOITALRROC' },
  { word: 'DIVERGENCE', clue: 'Price separation', scrambled: 'ECNEGREVID' },
  { word: 'CONVERGENCE', clue: 'Price alignment', scrambled: 'ECNEGREVNOC' },
  { word: 'RESISTANCE', clue: 'Price ceiling', scrambled: 'ECNATSISER' },
  { word: 'SUPPORT', clue: 'Price floor', scrambled: 'TROPPUS' },
  { word: 'BREAKOUT', clue: 'Price breakthrough', scrambled: 'TUOKAERB' },
  { word: 'REVERSAL', clue: 'Trend change', scrambled: 'LASREVER' },
  { word: 'MOMENTUM', clue: 'Price strength', scrambled: 'MUTNEMOM' },
  { word: 'INDICATOR', clue: 'Analysis tool', scrambled: 'ROTACIDNI' },
  { word: 'OSCILLATOR', clue: 'Range indicator', scrambled: 'ROTALLIOCS' },
  { word: 'CANDLESTICK', clue: 'Price chart type', scrambled: 'KCITSELDNAC' },
  { word: 'FIBONACCI', clue: 'Retracement levels', scrambled: 'ICCANOBI' },
  { word: 'BOLLINGER', clue: 'Volatility bands', scrambled: 'REGNILLOB' },
  { word: 'MACD', clue: 'Moving average indicator', scrambled: 'DCAM' },
  { word: 'RSI', clue: 'Relative strength', scrambled: 'ISR' },
  { word: 'MULTICHAIN', clue: 'Multiple blockchain support', scrambled: 'NIAHCITLUM' },
  { word: 'INTERCHAIN', clue: 'Between blockchains', scrambled: 'NIAHCRETNI' },
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
  const [timeLeft, setTimeLeft] = useState<number>(10);

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
      setTimeLeft(10); // Reset timer

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

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      // Time's up - auto submit as lost
      setGameState('lost');
    }
  }, [gameState, timeLeft]);

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
    setTimeLeft(10);
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
          {/* Timer */}
          <div className="flex justify-center">
            <div className={`px-6 py-3 rounded-full font-bold text-2xl ${timeLeft <= 3 ? 'bg-red-500 text-white animate-pulse' :
              timeLeft <= 5 ? 'bg-yellow-500 text-white' :
                'bg-green-500 text-white'
              }`}>
              <Timer className="w-6 h-6" /> {timeLeft}s
            </div>
          </div>

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
            <PartyPopper className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Congratulations!
          </h3>
          <p className="text-gray-600 mb-2">
            You solved the puzzle correctly!
          </p>

          {bonusMultiplier > 1.0 && rewards && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-1 mb-2 text-orange-700">
                <Flame className="w-4 h-4" />
                <p className="text-sm font-semibold">
                  Talent Bonus: {bonusMultiplier}x
                </p>
              </div>
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
            {timeLeft === 0 ? (
              <Timer className="w-12 h-12 text-white" />
            ) : (
              <Frown className="w-12 h-12 text-white" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            {timeLeft === 0 ? 'Time\'s Up!' : 'Wrong Answer!'}
          </h3>
          <p className="text-gray-600 mb-2">
            The correct answer was: <strong>{puzzle?.word}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {timeLeft === 0 ? 'You ran out of time!' : 'Better luck next time!'}
          </p>
          <button onClick={handlePlayAgain} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
