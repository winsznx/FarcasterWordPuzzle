const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting deployment to Celo...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy Custom Token 1
  console.log("\n1. Deploying Custom Token 1...");
  const CustomToken1 = await hre.ethers.getContractFactory("CustomToken");
  const token1 = await CustomToken1.deploy(
    "Game Token 1",
    "GT1",
    100000 // 100,000 tokens initial supply
  );
  await token1.waitForDeployment();
  const token1Address = await token1.getAddress();
  console.log("Custom Token 1 deployed to:", token1Address);

  // 2. Deploy Custom Token 2
  console.log("\n2. Deploying Custom Token 2...");
  const CustomToken2 = await hre.ethers.getContractFactory("CustomToken");
  const token2 = await CustomToken2.deploy(
    "Game Token 2",
    "GT2",
    100000 // 100,000 tokens initial supply
  );
  await token2.waitForDeployment();
  const token2Address = await token2.getAddress();
  console.log("Custom Token 2 deployed to:", token2Address);

  // 3. Deploy GameNFT
  console.log("\n3. Deploying Game NFT Contract...");
  const GameNFT = await hre.ethers.getContractFactory("GameNFT");
  const nft = await GameNFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("Game NFT deployed to:", nftAddress);

  // 4. Deploy RewardVault (using deployer as initial signer)
  console.log("\n4. Deploying Reward Vault...");
  const RewardVault = await hre.ethers.getContractFactory("RewardVault");
  const vault = await RewardVault.deploy(deployer.address);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("Reward Vault deployed to:", vaultAddress);

  // 5. Deploy GamePlay Contract
  console.log("\n5. Deploying GamePlay Contract...");
  const GamePlay = await hre.ethers.getContractFactory("GamePlay");
  const game = await GamePlay.deploy(nftAddress, vaultAddress);
  await game.waitForDeployment();
  const gameAddress = await game.getAddress();
  console.log("GamePlay deployed to:", gameAddress);

  // 6. Configure Reward Vault
  console.log("\n6. Configuring Reward Vault...");

  // WCT and CELO addresses on Celo mainnet
  const WCT_ADDRESS = "0xeF4461891DfB3AC8572cCf7C794664A8DD927945";
  const CELO_ADDRESS = "0x471ece3750da237f93b8e339c536989b8978a438";

  await vault.updateRewardToken(0, token1Address, hre.ethers.parseUnits("10", 18));
  await vault.updateRewardToken(1, token2Address, hre.ethers.parseUnits("10", 18));
  await vault.updateRewardToken(2, WCT_ADDRESS, hre.ethers.parseUnits("0.1", 18));
  await vault.updateRewardToken(3, CELO_ADDRESS, hre.ethers.parseUnits("0.02", 18));
  console.log("Reward tokens configured");

  // 7. Transfer tokens to vault
  console.log("\n7. Transferring tokens to vault...");

  // Transfer Custom Token 1 (1000 tokens for 100 wins @ 10 per win)
  await token1.transfer(vaultAddress, hre.ethers.parseUnits("1000", 18));
  console.log("Transferred 1000 GT1 to vault");

  // Transfer Custom Token 2 (1000 tokens for 100 wins @ 10 per win)
  await token2.transfer(vaultAddress, hre.ethers.parseUnits("1000", 18));
  console.log("Transferred 1000 GT2 to vault");

  console.log("\n⚠️  IMPORTANT: You need to manually fund the vault with:");
  console.log("- 10 WCT (0.1 WCT × 100 wins)");
  console.log("- 2 CELO (0.02 CELO × 100 wins)");

  // Save deployment addresses
  const deploymentInfo = {
    network: "celo",
    deployer: deployer.address,
    contracts: {
      nft: nftAddress,
      game: gameAddress,
      vault: vaultAddress,
      token1: token1Address,
      token2: token2Address,
      wct: WCT_ADDRESS,
      celo: CELO_ADDRESS,
    },
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment-addresses.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment complete!");
  console.log("Deployment info saved to deployment-addresses.json");

  console.log("\n📝 Next steps:");
  console.log("1. Update .env with contract addresses");
  console.log("2. Fund vault with WCT and CELO tokens");
  console.log("3. Update BACKEND_PRIVATE_KEY in .env with signer address");
  console.log("4. Verify contracts on Celoscan");
  console.log("5. Update farcaster.json manifest with your domain");
  console.log("6. Generate account association signature for manifest");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
