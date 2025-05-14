import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-web3-v4";
import "hardhat-gas-reporter";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "ETH",
    currencyDisplayPrecision: 4,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    L1Etherscan: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
