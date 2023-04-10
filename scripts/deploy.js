const hre = require("hardhat");

async function main() {
  const Vest = await hre.ethers.getContractFactory("Vesting");
  const vest = await Vest.deploy();

  await vest.deployed();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
