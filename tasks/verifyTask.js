const { task } = require("hardhat/config");

task("verify-task", "Verify deployed contract on Etherscan")
  .addParam("contractaddress", "Contract address deployed")
  .setAction(async (taskArgs) => {
    try {
      await hre.run("verify:verify", {
        address: taskArgs.contractaddress,
        contract: "contracts/vesting.sol:Vesting",
      });
    } catch ({ message }) {
      console.error(message);
    }
  });
