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
      url: "https://polygon-mumbai.g.alchemy.com/v2/Z3uUYm-JtLrkeOtAWIYHLzENe3tRyj5k",
      accounts: [`${process.env.POLYGON_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: "8FZG3HTQH2JJTWUM4Z1D6ZXI3SC36TD867",
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    gasPrice: 21,
    coinmarketcap: COINMARKETCAP_API,
    token: "MATIC",
  },
};
