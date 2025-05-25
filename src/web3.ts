import Web3 from "web3";

const INFURA_ENDPOINT =
  process.env.ETH_ENV == "test"
    ? `http://localhost:8545`
    : `https://sepolia.infura.io/v3/${process.env.SEPOLIA_API_KEY}`;

let web3: Web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(INFURA_ENDPOINT);
  web3 = new Web3(provider);
}

export default web3;
