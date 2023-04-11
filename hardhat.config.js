require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv").config();

const COINMARKETCAP_API = process.env.COINMARKETCAP_API;
require("./tasks/deployTask");
require("./tasks/verifyTask");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/`${process.env.ALCHEMY_API}`",
      accounts: [`${process.env.POLYGON_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `${process.env.ALCHEMY_API}`,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 21,
    coinmarketcap: COINMARKETCAP_API,
    token: "MATIC",
  },
};
