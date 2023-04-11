const { hexStripZeros } = require("ethers/lib/utils");
const { task } = require("hardhat/config");

task("deploy", "Deploy your contract").setAction(async (taskArgs) => {
  await hre.run("compile");

  const vest = await hre.ethers.getContractFactory("Vesting");
  const afterDeploy = await vest.deploy();

  await afterDeploy.deployed();
  console.log("Contract Deplyed Successfully..  at ", afterDeploy.address);
});
