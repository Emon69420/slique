// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying VaultHive contracts to Monad testnet...\n");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance), "MON\n");

    if (balance.lt(ethers.utils.parseEther("0.1"))) {
        throw new Error("Insufficient balance for deployment. Need at least 0.1 MON for gas fees.");
    }

    // Deploy VAULT Token Contract
    console.log("📄 Deploying VaultToken contract...");
    
    const VaultToken = await ethers.getContractFactory("VaultToken");
    
    // Constructor parameters
    const initialOwner = deployer.address;
    const initialSupply = ethers.utils.parseEther("1000000"); // 1M VAULT tokens for testing
    
    const vaultToken = await VaultToken.deploy(initialOwner, initialSupply);
    await vaultToken.deployed();
    
    console.log("✅ VaultToken deployed to:", vaultToken.address);
    console.log("   - Owner:", initialOwner);
    console.log("   - Initial Supply:", ethers.utils.formatEther(initialSupply), "VAULT");
    
    // Verify contract deployment
    const tokenName = await vaultToken.name();
    const tokenSymbol = await vaultToken.symbol();
    const totalSupply = await vaultToken.totalSupply();
    
    console.log("   - Token Name:", tokenName);
    console.log("   - Token Symbol:", tokenSymbol);
    console.log("   - Total Supply:", ethers.utils.formatEther(totalSupply), "VAULT\n");

    // Deploy Asset NFT Contract (if exists)
    try {
        console.log("📄 Looking for AssetNFT contract...");
        const AssetNFT = await ethers.getContractFactory("AssetNFT");
        
        const assetNFT = await AssetNFT.deploy(
            "VaultHive Asset NFT",
            "VHASSET",
            deployer.address
        );
        await assetNFT.deployed();
        
        console.log("✅ AssetNFT deployed to:", assetNFT.address);
        console.log("   - Name: VaultHive Asset NFT");
        console.log("   - Symbol: VHASSET");
        console.log("   - Owner:", deployer.address, "\n");
        
    } catch (error) {
        console.log("ℹ️  AssetNFT contract not found or deployment failed. Skipping...\n");
    }

    // Set up contract permissions
    console.log("🔧 Setting up contract permissions...");
    
    // Authorize the deployer as a minter (in production, this would be the backend service)
    const authTx = await vaultToken.setMinterAuthorization(deployer.address, true);
    await authTx.wait();
    console.log("✅ Deployer authorized as minter");

    // Test minting functionality
    console.log("\n🧪 Testing contract functionality...");
    
    const testRecipient = "0x742d35Cc6635C0532925a3b8D5c4C7844281D0AA"; // Test address
    const testAmount = ethers.utils.parseEther("100"); // 100 VAULT tokens
    
    try {
        const mintTx = await vaultToken.mintReward(
            testRecipient,
            testAmount,
            "Test reward"
        );
        await mintTx.wait();
        
        const recipientBalance = await vaultToken.balanceOf(testRecipient);
        console.log("✅ Test mint successful");
        console.log("   - Recipient:", testRecipient);
        console.log("   - Amount minted:", ethers.utils.formatEther(testAmount), "VAULT");
        console.log("   - Recipient balance:", ethers.utils.formatEther(recipientBalance), "VAULT");
        
    } catch (error) {
        console.error("❌ Test mint failed:", error.message);
    }

    // Get contract info
    const contractInfo = await vaultToken.getContractInfo();
    console.log("\n📊 Contract Information:");
    console.log("   - Current Supply:", ethers.utils.formatEther(contractInfo.currentSupply), "VAULT");
    console.log("   - Max Supply:", ethers.utils.formatEther(contractInfo.maxSupply), "VAULT");
    console.log("   - Remaining Supply:", ethers.utils.formatEther(contractInfo.remainingSupply), "VAULT");
    console.log("   - Is Paused:", contractInfo.isPaused);

    // Generate deployment info for frontend
    const deploymentInfo = {
        network: "monad_testnet",
        chainId: 88888,
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            VaultToken: {
                address: vaultToken.address,
                name: tokenName,
                symbol: tokenSymbol,
                totalSupply: ethers.utils.formatEther(totalSupply),
                maxSupply: ethers.utils.formatEther(await vaultToken.MAX_SUPPLY()),
            }
        },
        transactions: {
            deployment: vaultToken.deployTransaction.hash,
            authorization: authTx.hash
        }
    };

    console.log("\n💾 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Save deployment info to file
    const fs = require('fs');
    const path = require('path');
    
    const deploymentDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentDir)) {
        fs.mkdirSync(deploymentDir, { recursive: true });
    }
    
    const deploymentFile = path.join(deploymentDir, 'monad_testnet.json');
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n💾 Deployment info saved to:", deploymentFile);

    // Generate frontend configuration
    const frontendConfig = {
        VAULT_TOKEN_ADDRESS: vaultToken.address,
        MONAD_CHAIN_ID: "0x15b38", // 88888 in hex
        MONAD_RPC_URL: "https://testnet1.monad.xyz/",
        BLOCK_EXPLORER_URL: "https://explorer.testnet1.monad.xyz/",
        DEPLOYMENT_BLOCK: vaultToken.deployTransaction.blockNumber,
    };

    const configFile = path.join(__dirname, '..', 'frontend', 'js', 'config.js');
    const configContent = `// Auto-generated contract configuration
const CONTRACT_CONFIG = ${JSON.stringify(frontendConfig, null, 2)};

// Make config available globally
window.CONTRACT_CONFIG = CONTRACT_CONFIG;

// Update blockchain service with contract addresses
if (typeof blockchainService !== 'undefined') {
    blockchainService.contractAddresses.vaultToken = CONTRACT_CONFIG.VAULT_TOKEN_ADDRESS;
}

console.log('📄 Contract configuration loaded:', CONTRACT_CONFIG);
`;

    fs.writeFileSync(configFile, configContent);
    console.log("📄 Frontend configuration saved to:", configFile);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n🔗 Useful Links:");
    console.log("   - VaultToken Contract:", `https://explorer.testnet1.monad.xyz/address/${vaultToken.address}`);
    console.log("   - Deployment Transaction:", `https://explorer.testnet1.monad.xyz/tx/${vaultToken.deployTransaction.hash}`);
    
    console.log("\n📝 Next Steps:");
    console.log("   1. Update backend with contract address:", vaultToken.address);
    console.log("   2. Authorize backend service as minter");
    console.log("   3. Test frontend integration");
    console.log("   4. Fund deployer account for ongoing operations");
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
