/**
 * MiniApp configuration for Word Puzzle - NFT-Gated Puzzle Game
 * 
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */

const ROOT_URL = 'https://farcaster-word-puzzle.vercel.app';

export const minikitConfig = {
    accountAssociation: {
        header: "eyJmaWQiOjEzNzEyNTQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg4NzQ5ZDk0MDMzN2M4MzhmMGU0MDQ2NDMzY0QxNjdhMzVmNzUzYmQwIn0",
        payload: "eyJkb21haW4iOiJmYXJjYXN0ZXItd29yZC1wdXp6bGUudmVyY2VsLmFwcCJ9",
        signature: "WyyHHFEKVsXP5L0A0h8d7BPn/gPtcnFcaDAJp5FtVdInt3KMADTJA2St2+GbMufVBIFEG1gE0IuXWBxjiYeRLBw="
    },
    miniapp: {
        version: "1",
        name: "Word Puzzle",
        subtitle: "Solve puzzles, earn crypto",
        description: "NFT-gated word puzzle game with multi-chain crypto rewards on Base and Celo. Solve crypto-themed word puzzles and earn tokens!",
        iconUrl: `${ROOT_URL}/icon.png`,
        homeUrl: ROOT_URL,
        imageUrl: `${ROOT_URL}/og-image.png`,
        buttonTitle: "Play Game",
        splashImageUrl: `${ROOT_URL}/splash.png`,
        splashBackgroundColor: "#e35336",
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "games",
        tags: ["puzzle", "crypto", "nft", "base", "rewards"],
        screenshotUrls: [`${ROOT_URL}/screenshot.png`],
        heroImageUrl: `${ROOT_URL}/hero.png`,
        tagline: "Solve puzzles, earn crypto rewards",
        ogTitle: "Word Puzzle Game",
        ogDescription: "Solve crypto-themed word puzzles and earn tokens on Base and Celo!",
        ogImageUrl: `${ROOT_URL}/og-image.png`,
        // Required chains for multi-chain support
        requiredChains: [
            "eip155:8453",   // Base Mainnet
            "eip155:42220"   // Celo Mainnet
        ],
        // Required capabilities for wallet interactions
        requiredCapabilities: [
            "wallet.getEthereumProvider",
            "wallet.signTypedDataV4",
            "actions.addMiniApp"
        ]
    },
} as const;

// For backward compatibility with frame
export const { miniapp: frame } = minikitConfig;
