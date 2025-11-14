// Contract Addresses on BASE (Primary Chain)
export const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x') as `0x${string}`;
export const GAME_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS || '0x') as `0x${string}`;
export const BASE_VAULT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_BASE_VAULT_CONTRACT_ADDRESS || '0x') as `0x${string}`;
export const TOKEN1_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN1_CONTRACT_ADDRESS || '0x') as `0x${string}`;
export const WCT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_WCT_CONTRACT_ADDRESS || '0x1509706a6c66CA549ff0cB464de88231DDBe213B') as `0x${string}`;

// Contract Addresses on CELO (Secondary Chain for rewards)
export const CELO_VAULT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CELO_VAULT_CONTRACT_ADDRESS || '0x') as `0x${string}`;
export const TOKEN2_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN2_CONTRACT_ADDRESS || '0x') as `0x${string}`;
export const CELO_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_CELO_TOKEN_ADDRESS || '0x471ece3750da237f93b8e339c536989b8978a438') as `0x${string}`;

// ABIs
export const NFT_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'hasMinted',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const GAME_ABI = [
  {
    inputs: [{ name: 'level', type: 'uint256' }],
    name: 'play',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'databytes', type: 'bytes' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    name: 'validateWin',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const VAULT_ABI = [
  {
    inputs: [
      { name: 'databytes', type: 'bytes' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'slot', type: 'uint8' },
      { name: 'token', type: 'address' },
      { name: 'maxClaim', type: 'uint256' },
    ],
    name: 'updateRewardToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
