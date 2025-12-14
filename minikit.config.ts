/**
 * MiniApp configuration for Word Puzzle - NFT-Gated Puzzle Game
 * 
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */

const ROOT_URL = 'https://farcaster-word-puzzle.vercel.app';

export const minikitConfig = {
    accountAssociation: {
        // IMPORTANT: Replace these with your signed values from:
        // https://farcaster.xyz/~/developers/mini-apps/manifest?domain=farcaster-word-puzzle.vercel.app
        header: "PLACEHOLDER_REPLACE_WITH_SIGNED_HEADER",
        payload: "PLACEHOLDER_REPLACE_WITH_SIGNED_PAYLOAD",
        signature: "PLACEHOLDER_REPLACE_WITH_SIGNED_SIGNATURE"
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
    },
} as const;

// For backward compatibility with frame
export const { miniapp: frame } = minikitConfig;
