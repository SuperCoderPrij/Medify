import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  if (balance === 0n) {
    console.error("Insufficient funds. Please fund the deployer address.");
    process.exit(1);
  }

  const PharmaNFT = await ethers.getContractFactory("PharmaNFT");
  const pharmaNFT = await PharmaNFT.deploy();

  await pharmaNFT.waitForDeployment();

  const address = await pharmaNFT.getAddress();
  console.log("PharmaNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
