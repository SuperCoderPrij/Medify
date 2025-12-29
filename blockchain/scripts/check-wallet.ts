import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.log("No private key found in .env. Please run generate-wallet.ts first.");
    return;
  }

  // Create a wallet instance (without provider first to get address safely)
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Wallet Address: ${wallet.address}`);
  
  try {
    // Try to connect to provider to get balance
    if (ethers.provider) {
        const balance = await ethers.provider.getBalance(wallet.address);
        console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);
    } else {
        console.log("No provider configured.");
    }
  } catch (e) {
    console.log("Could not fetch balance (network might be down or misconfigured):", e.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
