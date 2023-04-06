const { hexStripZeros } = require("ethers/lib/utils");
const { task } = require("hardhat/config");

task("deploy", "Deploy your contract")
  .addParam("token", "Token Address")
  .setAction(async (taskArgs) => {
    await hre.run("compile");

    const vest = await hre.ethers.getContractFactory("Vesting");
    const afterDeploy = await vest.deploy(taskArgs.token);

    await afterDeploy.deployed();
    console.log("Contract Deplyed Successfully..  at ", afterDeploy.address);
  });
