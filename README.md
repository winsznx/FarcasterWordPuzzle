# Word Puzzle Game - Farcaster Mini App

NFT-gated word puzzle game with multi-chain crypto rewards on Base and Celo blockchains. Built as a Farcaster Mini App with full SDK integration and Talent Protocol bonus system.

## 🎮 Features

- **Word Puzzle Game**: Solve scrambled word puzzles across multiple difficulty levels
- **NFT-Gated Access**: Mint access NFTs to play (Level 1, 2, or 3)
- **Multi-Chain Rewards**: Earn tokens on both Base and Celo networks
- **Talent Protocol Integration**: Higher Builder Scores earn up to 2x bonus rewards
- **Farcaster Integration**: Seamless wallet connection and social sharing
- **Dual-Chain Architecture**: Base (primary) + Celo (rewards distribution)
- **Beautiful UI**: Responsive design with custom brand colors

## 💰 Reward System

### Base Rewards (Per Win)
- **10 PUZZ** (Puzzle Token on Base)
- **10 RWRD** (Reward Token on Celo)
- **0.1 WCT** (Wrapped Celo Token on Base)
- **0.05 CELO** (Native token on Celo)

### Talent Protocol Bonus Multiplier
Players with high Talent Builder Scores earn bonus rewards on PUZZ and RWRD:

- **Elite Builder** (Score ≥80): **2x bonus** → 20 PUZZ + 20 RWRD
- **Top Builder** (Score ≥60): **1.5x bonus** → 15 PUZZ + 15 RWRD
- **Rising Builder** (Score ≥40): **1.2x bonus** → 12 PUZZ + 12 RWRD
- **Standard** (Score <40): **1x** → 10 PUZZ + 10 RWRD

*Note: WCT and CELO amounts are NOT affected by Talent bonus*

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Farcaster Mini App SDK** for Farcaster integration
- **Wagmi v2** for Ethereum interactions
- **Reown AppKit** for wallet connections

### Smart Contracts
- **Solidity 0.8.20**
- **OpenZeppelin** contracts for security
- **Hardhat** development framework
- **Multi-chain deployment** (Base + Celo)

### Backend
- **Next.js API Routes**
- **Ethers.js v6** for signature generation
- **Talent Protocol API** for Builder Score integration

### Blockchain Networks
- **Base Mainnet** (Chain ID: 8453) - Primary network, gameplay contracts
- **Celo Mainnet** (Chain ID: 42220) - Reward distribution

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── game/
│   │   │   └── submit/          # Game submission with Talent bonus
│   │   └── talent/
│   │       ├── score/           # Individual Talent score lookup
│   │       └── leaderboard/     # Leaderboard API
│   ├── talent/
│   │   └── page.tsx             # Talent Profile viewer
│   ├── leaderboard/
│   │   └── page.tsx             # Leaderboard page
│   ├── layout.tsx               # Root layout with Farcaster meta
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # Wagmi providers
├── components/
│   ├── ConnectButton.tsx        # Wallet connection
│   ├── FarcasterProvider.tsx   # Farcaster context
│   ├── GameDashboard.tsx       # Game dashboard
│   ├── GamePlay.tsx            # Main game component
│   ├── LevelSelector.tsx       # Level selection
│   ├── NFTMintSection.tsx      # NFT minting UI
│   ├── PlayerStats.tsx         # Player statistics
│   └── RewardClaim.tsx         # Reward claiming UI
├── contracts/
│   ├── CustomToken.sol         # ERC20 tokens (PUZZ, RWRD)
│   ├── GameNFT.sol             # ERC1155 access NFTs
│   ├── GamePlay.sol            # Game logic contract
│   └── RewardVault.sol         # Multi-chain reward distribution
├── lib/
│   ├── contracts.ts            # Contract addresses & ABIs
│   ├── wagmi.ts                # Wagmi configuration
│   └── talent.ts               # Talent Protocol integration
├── scripts/
│   ├── deploy-base.js          # Deploy to Base
│   └── deploy-celo.js          # Deploy to Celo
└── public/
    └── .well-known/
        └── farcaster.json      # Farcaster manifest
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd FarcasterWordPuzzle
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CELO_CHAIN_ID=42220

# Contract Addresses (update after deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=
NEXT_PUBLIC_BASE_VAULT_CONTRACT_ADDRESS=
NEXT_PUBLIC_TOKEN1_CONTRACT_ADDRESS=
NEXT_PUBLIC_CELO_VAULT_CONTRACT_ADDRESS=
NEXT_PUBLIC_TOKEN2_CONTRACT_ADDRESS=

# API Keys
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
TALENT_PROTOCOL_API_KEY=your_talent_api_key

# Backend (KEEP PRIVATE!)
BACKEND_PRIVATE_KEY=your_backend_private_key
DEPLOYER_PRIVATE_KEY=your_deployer_private_key

# App URLs (update for production)
NEXT_PUBLIC_APP_DOMAIN=your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**⚠️ SECURITY WARNING**: Never commit `.env` to git! It's already in `.gitignore`.

### 3. Smart Contract Deployment

#### Compile Contracts
```bash
npx hardhat compile
```

#### Deploy to Base Mainnet
```bash
npx hardhat run scripts/deploy-base.js --network base
```

This deploys:
- GameNFT (ERC1155)
- GamePlay contract
- Base Vault
- PUZZ Token (ERC20)

#### Deploy to Celo Mainnet
```bash
npx hardhat run scripts/deploy-celo.js --network celo
```

This deploys:
- Celo Vault
- RWRD Token (ERC20)

#### Verify Contracts
```bash
# Base contracts
npx hardhat verify --network base <NFT_ADDRESS>
npx hardhat verify --network base <GAMEPLAY_ADDRESS> <NFT_ADDRESS> <VAULT_ADDRESS>
npx hardhat verify --network base <VAULT_ADDRESS> <DEPLOYER_ADDRESS>
npx hardhat verify --network base <PUZZ_ADDRESS> "Puzzle Token" "PUZZ" "100000"

# Celo contracts
npx hardhat verify --network celo <CELO_VAULT_ADDRESS> <DEPLOYER_ADDRESS>
npx hardhat verify --network celo <RWRD_ADDRESS> "Reward Token" "RWRD" "100000"
```

### 4. Fund the Vaults

After deployment, fund the vaults to enable rewards:

```bash
# Send 10 WCT to Base Vault
# Send 5 CELO to Celo Vault
```

### 5. Update .env

Update `.env` with deployed contract addresses from `deployment-base.json` and `deployment-celo.json`

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Deployment to Production

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables from `.env` (except `DEPLOYER_PRIVATE_KEY`)
- Deploy

3. **Update Environment Variables**

After deployment, update these in both `.env` and Vercel:
```
NEXT_PUBLIC_APP_DOMAIN=your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. **Redeploy**

Trigger a redeployment in Vercel after updating the URL variables.

## 🎮 Game Flow

1. **Connect Wallet** - User connects via Farcaster SDK or wallet
2. **Check Talent Score** - View your Talent Builder Score and bonus tier
3. **Mint NFT** - Purchase Level 1, 2, or 3 access NFT
4. **Start Game** - Pay small play fee (0.0000001 ETH)
5. **Solve Puzzle** - Unscramble the word within time limit
6. **Win Rewards** - Automatically claim multi-chain rewards with Talent bonus
7. **Share on Farcaster** - Cast about your win and earn reputation

## 📋 Smart Contracts

### Base Mainnet Contracts

**GameNFT** (ERC1155)
- Level 1, 2, 3 access tokens
- Mint price: 0.000003 ETH
- One mint per level per address

**GamePlay**
- Validates NFT ownership
- Collects play fees: 0.0000001 ETH
- Tracks player statistics
- Integrates with reward vaults

**Base Vault**
- Holds WCT and PUZZ tokens
- Signature-based claiming
- Nonce tracking for replay protection

**PUZZ Token** (ERC20)
- Custom game token
- 100,000 total supply
- Distributed as rewards

### Celo Mainnet Contracts

**Celo Vault**
- Holds CELO and RWRD tokens
- Cross-chain reward distribution
- Synchronized with Base Vault

**RWRD Token** (ERC20)
- Custom reward token
- 100,000 total supply
- Enhanced by Talent bonus

## 🏆 Talent Protocol Integration

The game integrates with Talent Protocol to reward high-quality builders:

### How It Works

1. Game fetches your Farcaster FID from the SDK
2. Backend queries Talent Protocol API for your Builder Score
3. Bonus multiplier is calculated based on score tier
4. PUZZ and RWRD rewards are multiplied (WCT and CELO unchanged)
5. You see your bonus tier in the game UI

### View Your Talent Profile

Navigate to `/talent` to see:
- Your Builder Score and rank
- Current bonus multiplier
- Reward amounts with bonus applied
- Tier progression

### Leaderboard

Navigate to `/leaderboard` to see:
- Top builders playing the game
- Their scores and bonus tiers
- Potential rewards per win

## 🎨 Brand Colors

```css
--brand-orange: #e35336
--brand-cream: #f5f5dc
--brand-tan: #f4a460
--brand-brown: #a0522d
```

## 🔒 Security

- ✅ Private keys stored in environment variables (never committed)
- ✅ Signature verification for all reward claims
- ✅ Nonce system prevents replay attacks
- ✅ NFT ownership verified before gameplay
- ✅ Input validation on all user inputs
- ✅ Multi-chain architecture for redundancy
- ✅ `.gitignore` configured to protect sensitive files

### Files Protected by .gitignore
- `.env` (all variations)
- `deployment-base.json`
- `deployment-celo.json`
- All `.md` files except `README.md`
- Private keys and API keys

## 📝 Production Checklist

- [x] Deploy smart contracts to Base mainnet
- [x] Deploy smart contracts to Celo mainnet
- [x] Verify contracts on Basescan and Sourcify
- [x] Verify contracts on Celoscan and Sourcify
- [x] Fund Base Vault with WCT and PUZZ
- [x] Fund Celo Vault with CELO and RWRD
- [x] Integrate Talent Protocol API
- [ ] Set up production database (replace in-memory nonce storage with Redis)
- [ ] Add rate limiting to API endpoints
- [ ] Configure monitoring and logging (Sentry, etc.)
- [ ] Update Farcaster manifest with production domain
- [ ] Generate and add account association
- [ ] Deploy frontend to Vercel
- [ ] Test complete flow on mainnet
- [ ] Create custom OG images
- [ ] Test in Warpcast and other Farcaster clients
- [ ] Set up analytics

## 🌐 API Endpoints

### Game APIs
- `POST /api/game/submit` - Submit answer with Talent bonus calculation

### Talent APIs
- `GET /api/talent/score?fid=123` - Get individual Talent score
- `POST /api/talent/leaderboard` - Get leaderboard with scores

## 🔗 Resources

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/developers/mini-apps)
- [Talent Protocol API](https://docs.talentprotocol.com)
- [Base Network](https://base.org)
- [Celo Documentation](https://docs.celo.org)
- [Wagmi Documentation](https://wagmi.sh)
- [Reown AppKit](https://docs.reown.com/appkit)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

## 🤝 Contributing

Contributions are welcome! Please ensure:
- All tests pass
- Code follows existing style
- Private keys are never committed
- Documentation is updated

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always verify transactions and never share private keys.

## 🆘 Support

For issues or questions:
- Review documentation files
- Check Farcaster Mini Apps docs
- Open an issue on GitHub
- Review contract verification on Basescan/Celoscan

---

**Built with ❤️ for the Farcaster and Web3 community**
