import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PharmaNFT contract...");

  // The address provided by the user to be the initial owner
  const initialOwner = "0x1FdD7aa04Aa2FC749b5f05f543aFd18CD782FaCe";

  const PharmaNFT = await ethers.getContractFactory("PharmaNFT");
  const pharmaNFT = await PharmaNFT.deploy(initialOwner);

  await pharmaNFT.waitForDeployment();

  const address = await pharmaNFT.getAddress();

  console.log(`PharmaNFT deployed to: ${address}`);
  console.log("IMPORTANT: Copy this address and update src/lib/blockchain.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
