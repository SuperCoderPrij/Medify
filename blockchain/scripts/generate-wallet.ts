import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {
  // Create a random wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log("----------------------------------------------------");
  console.log("NEW TEST WALLET GENERATED");
  console.log("----------------------------------------------------");
  console.log("Address:     " + wallet.address);
  console.log("Private Key: " + wallet.privateKey);
  console.log("----------------------------------------------------");
  console.log("Instructions:");
  console.log("1. Copy the Address above.");
  console.log("2. Go to the Polygon Amoy Faucet (https://faucet.polygon.technology/).");
  console.log("3. Paste the address and request free testnet MATIC.");
  console.log("4. Once funded, tell the AI to 'Deploy the contract'.");
  console.log("----------------------------------------------------");

  // Save to .env file automatically
  const envPath = path.join(__dirname, "../.env");
  const envContent = `PRIVATE_KEY=${wallet.privateKey}\n`;
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Wallet configured in ${envPath}`);
  } catch (err) {
    console.error("Error writing .env file:", err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
