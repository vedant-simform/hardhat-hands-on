const hre = require("hardhat");

async function main() {
  const Vest = await hre.ethers.getContractFactory("Vesting");
  const vest = await Vest.deploy("0x326C977E6efc84E512bB9C30f76E30c160eD06FB");

  await vest.deployed();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
