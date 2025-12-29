import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const PharmaNFT = await ethers.getContractFactory("PharmaNFT");
  const pharmaNFT = await PharmaNFT.deploy();

  console.log("Waiting for deployment...");
  await pharmaNFT.waitForDeployment();

  const address = await pharmaNFT.getAddress();
  console.log("PharmaNFT deployed to:", address);

  // Update the frontend configuration automatically
  const frontendPath = path.join(__dirname, "../../src/lib/blockchain.ts");
  
  if (fs.existsSync(frontendPath)) {
    let content = fs.readFileSync(frontendPath, "utf8");
    // Replace the address with the new deployed address
    content = content.replace(
      /export const PHARMA_NFT_ADDRESS = ".*";/,
      `export const PHARMA_NFT_ADDRESS = "${address}";`
    );
    fs.writeFileSync(frontendPath, content);
    console.log(`✅ Updated src/lib/blockchain.ts with new contract address: ${address}`);
  } else {
    console.error("❌ Could not find src/lib/blockchain.ts to update.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
