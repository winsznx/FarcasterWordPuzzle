const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting deployment to BASE MAINNET...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // 1. Deploy Custom Token 1 (on Base)
  console.log("\n1. Deploying Custom Token 1 on Base...");
  const CustomToken1 = await hre.ethers.getContractFactory("CustomToken");
  const token1 = await CustomToken1.deploy(
    "Puzzle Token",
    "PUZZ",
    100000 // 100,000 tokens initial supply
  );
  await token1.waitForDeployment();
  const token1Address = await token1.getAddress();
  console.log("✅ Puzzle Token deployed to:", token1Address);

  // 2. Deploy GameNFT (on Base)
  console.log("\n2. Deploying Game NFT Contract on Base...");
  const GameNFT = await hre.ethers.getContractFactory("GameNFT");
  const nft = await GameNFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✅ Game NFT deployed to:", nftAddress);

  // 3. Deploy Base Vault (for Token1 + WCT)
  console.log("\n3. Deploying Base Vault...");
  const RewardVault = await hre.ethers.getContractFactory("RewardVault");
  const baseVault = await RewardVault.deploy(deployer.address);
  await baseVault.waitForDeployment();
  const baseVaultAddress = await baseVault.getAddress();
  console.log("✅ Base Vault deployed to:", baseVaultAddress);

  // 4. Deploy GamePlay Contract (on Base)
  console.log("\n4. Deploying GamePlay Contract on Base...");
  const GamePlay = await hre.ethers.getContractFactory("GamePlay");
  const game = await GamePlay.deploy(nftAddress, baseVaultAddress);
  await game.waitForDeployment();
  const gameAddress = await game.getAddress();
  console.log("✅ GamePlay deployed to:", gameAddress);

  // 5. Configure Base Vault with Token1 + WCT
  console.log("\n5. Configuring Base Vault...");

  // WCT address on Base mainnet
  const WCT_ADDRESS = "0x1509706a6c66CA549ff0cB464de88231DDBe213B";

  // Configure reward tokens
  await baseVault.updateRewardToken(0, token1Address, hre.ethers.parseUnits("10", 18));
  console.log("✅ Token1 configured: 10 PUZZ per win");

  await baseVault.updateRewardToken(1, WCT_ADDRESS, hre.ethers.parseUnits("0.1", 18));
  console.log("✅ WCT configured: 0.1 WCT per win");

  // 6. Transfer tokens to Base Vault
  console.log("\n6. Funding Base Vault...");

  // Transfer Custom Token 1 (1000 tokens for 100 wins @ 10 per win)
  await token1.transfer(baseVaultAddress, hre.ethers.parseUnits("1000", 18));
  console.log("✅ Transferred 1000 PUZZ to Base Vault");

  console.log("\n⚠️  IMPORTANT: Manually fund Base Vault with:");
  console.log("   - 10 WCT (0.1 WCT × 100 wins)");
  console.log("   - Send to:", baseVaultAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: "base",
    chainId: 8453,
    deployer: deployer.address,
    contracts: {
      nft: nftAddress,
      game: gameAddress,
      baseVault: baseVaultAddress,
      token1: token1Address,
      wct: WCT_ADDRESS,
    },
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment-base.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ BASE deployment complete!");
  console.log("Deployment info saved to deployment-base.json");

  console.log("\n📝 Next steps:");
  console.log("1. Fund Base Vault with 10 WCT");
  console.log("2. Run deploy-celo.js to deploy Celo contracts");
  console.log("3. Update .env with all contract addresses");
  console.log("4. Verify contracts on Basescan:");
  console.log(`   npx hardhat verify --network base ${nftAddress}`);
  console.log(`   npx hardhat verify --network base ${gameAddress} ${nftAddress} ${baseVaultAddress}`);
  console.log(`   npx hardhat verify --network base ${baseVaultAddress} ${deployer.address}`);
  console.log(`   npx hardhat verify --network base ${token1Address} "Puzzle Token" "PUZZ" "100000"`);

  console.log("\n🎯 Update your .env file:");
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${nftAddress}`);
  console.log(`NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=${gameAddress}`);
  console.log(`NEXT_PUBLIC_BASE_VAULT_CONTRACT_ADDRESS=${baseVaultAddress}`);
  console.log(`NEXT_PUBLIC_TOKEN1_CONTRACT_ADDRESS=${token1Address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
