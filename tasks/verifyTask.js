const { task } = require("hardhat/config");

// task("verify-contract", "Verify smart contract")
//   .addParam("address", "Enter deployed contract address")
//   .setAction(async (taskArgs) => {

//   });

task("verify-etherscan", "Verify deployed contract on Etherscan")
  .addParam("contractaddress", "Contract address deployed")
  .addParam("tokenvalue", "Enter token address")
  .setAction(async (taskArgs) => {
    try {
      await hre.run("verify:verify", {
        address: taskArgs.contractaddress,
        contract: "contracts/vesting.sol:Vesting",
        constructorArguments: [taskArgs.tokenvalue],
      });
    } catch ({ message }) {
      console.error(message);
    }
  });
