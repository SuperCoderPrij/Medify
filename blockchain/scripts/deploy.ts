import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PharmaNFT = await ethers.getContractFactory("PharmaNFT");
  const pharmaNFT = await PharmaNFT.deploy();

  await pharmaNFT.waitForDeployment();

  const address = await pharmaNFT.getAddress();

  console.log("PharmaNFT deployed to:", address);
  
  console.log("\nIMPORTANT: Update src/lib/blockchain.ts with this address:");
  console.log(`export const PHARMA_NFT_ADDRESS = "${address}";`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
