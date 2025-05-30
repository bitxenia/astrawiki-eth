import Web3 from "web3";

const INFURA_ENDPOINT =
  process.env.ETH_ENV == "test"
    ? `http://localhost:8545`
    : `https://sepolia.infura.io/v3/${process.env.SEPOLIA_API_KEY}`;

export class Web3Singleton {
  static #instance: Web3;

  private constructor() {}

  private static initialize() {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      window.ethereum.request({ method: "eth_requestAccounts" });
      this.#instance = new Web3(window.ethereum);
    } else {
      const provider = new Web3.providers.HttpProvider(INFURA_ENDPOINT);
      this.#instance = new Web3(provider);
    }
  }

  public static get instance(): Web3 {
    if (!Web3Singleton.#instance) {
      Web3Singleton.initialize();
    }

    return Web3Singleton.#instance;
  }
}
