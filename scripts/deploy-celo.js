const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting deployment to CELO MAINNET...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  // 1. Deploy Custom Token 2 (on Celo)
  console.log("\n1. Deploying Custom Token 2 on Celo...");
  const CustomToken2 = await hre.ethers.getContractFactory("CustomToken");
  const token2 = await CustomToken2.deploy(
    "Reward Token",
    "RWRD",
    100000 // 100,000 tokens initial supply
  );
  await token2.waitForDeployment();
  const token2Address = await token2.getAddress();
  console.log("✅ Reward Token deployed to:", token2Address);

  // 2. Deploy Celo Vault (for Token2 + CELO)
  console.log("\n2. Deploying Celo Vault...");
  const RewardVault = await hre.ethers.getContractFactory("RewardVault");
  const celoVault = await RewardVault.deploy(deployer.address);
  await celoVault.waitForDeployment();
  const celoVaultAddress = await celoVault.getAddress();
  console.log("✅ Celo Vault deployed to:", celoVaultAddress);

  // 3. Configure Celo Vault with Token2 + CELO
  console.log("\n3. Configuring Celo Vault...");

  // CELO token address on Celo mainnet
  const CELO_ADDRESS = "0x471ece3750da237f93b8e339c536989b8978a438";

  // Configure reward tokens
  await celoVault.updateRewardToken(0, token2Address, hre.ethers.parseUnits("10", 18));
  console.log("✅ Token2 configured: 10 RWRD per win");

  await celoVault.updateRewardToken(1, CELO_ADDRESS, hre.ethers.parseUnits("0.05", 18));
  console.log("✅ CELO configured: 0.05 CELO per win");

  // 4. Transfer tokens to Celo Vault
  console.log("\n4. Funding Celo Vault...");

  // Transfer Custom Token 2 (1000 tokens for 100 wins @ 10 per win)
  await token2.transfer(celoVaultAddress, hre.ethers.parseUnits("1000", 18));
  console.log("✅ Transferred 1000 RWRD to Celo Vault");

  console.log("\n⚠️  IMPORTANT: Manually fund Celo Vault with:");
  console.log("   - 5 CELO (0.05 CELO × 100 wins)");
  console.log("   - Send to:", celoVaultAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: "celo",
    chainId: 42220,
    deployer: deployer.address,
    contracts: {
      celoVault: celoVaultAddress,
      token2: token2Address,
      celo: CELO_ADDRESS,
    },
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment-celo.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ CELO deployment complete!");
  console.log("Deployment info saved to deployment-celo.json");

  console.log("\n📝 Next steps:");
  console.log("1. Fund Celo Vault with 5 CELO");
  console.log("2. Update .env with Celo contract addresses");
  console.log("3. Update backend to handle multi-chain rewards");
  console.log("4. Verify contracts on Celoscan:");
  console.log(`   npx hardhat verify --network celo ${celoVaultAddress} ${deployer.address}`);
  console.log(`   npx hardhat verify --network celo ${token2Address} "Reward Token" "RWRD" "100000"`);

  console.log("\n🎯 Update your .env file:");
  console.log(`NEXT_PUBLIC_CELO_VAULT_CONTRACT_ADDRESS=${celoVaultAddress}`);
  console.log(`NEXT_PUBLIC_TOKEN2_CONTRACT_ADDRESS=${token2Address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
