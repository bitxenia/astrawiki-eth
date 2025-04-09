# Astrawiki Ethereum Implementation

This is the Ethereum implementation of the [Astrawiki](https://github.com/bitxenia/astrawiki).

## Development

The Solidity contracts are in the [contracts](src/contracts) directory and require a wallet private key to deploy them as well as an Infura API key to deploy to the Testnet (both go as environment variables in `.env`). If the local Hardhat node is used then the Infura API key is not needed.

1. Start a local Hardhat node

```bash
npm run hardhat
```

2. Compile the contracts

```bash
npm run compile-contracts
```

3. Deploy the contracts

```bash
npm run deploy-contracts
```

This creates the ABIs and saves the deployed contract address in the `out` directory inside `contracts` to then be used by the application.

## License

MIT (LICENSE-MIT / http://opensource.org/licenses/MIT)
