const { task } = require("hardhat/config");

task("show-balance", "Shows the balance of all address", async () => {
  const accounts = await ethers.getSigners();
  for (let account of accounts) {
    console.log(
      "Balance of ",
      account.address,
      " is :- ",
      ethers.utils.formatEther(
        await ethers.provider.getBalance(account.address)
      )
    );
  }
});

task("show-my-balance", "Shows the balance of given address only")
  .addParam("account", "give account address")
  .setAction(async (taskArgs) => {
    console.log(
      ethers.utils.formatEther(
        await ethers.provider.getBalance(taskArgs.account)
      )
    );
  });

task("hello", "Prints a greeting")
  .addOptionalParam("greeting", "The greeting to print", "Hello, World!")
  .setAction(async ({ greeting }) => console.log(greeting));

// const { task } = require("hardhat/config");
// // const hre = require("hardhat/config");

// task("print", "Prints HELLO").setAction(async () => {
//   const accounts = await ethers.getSigners();
//   console.log(accounts[0].address);
// });
