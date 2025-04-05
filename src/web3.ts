import Web3 from "web3";

// TODO: medio sus
declare global {
  interface Window {
    dataLayer?: Object[];
    [key: string]: any;
  }
}

const INFURA_ENDPOINT = `https://sepolia.infura.io/v3/${process.env.SEPOLIA_API_KEY}`;

let web3: Web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(INFURA_ENDPOINT);
  web3 = new Web3(provider);
}

export default web3;
