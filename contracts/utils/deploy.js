const { Web3 } = require("web3");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./../../.env") });
const fs = require("fs");

const SEPOLIA_ENDPOINT = `https://sepolia.infura.io/v3/${process.env.SEPOLIA_API_KEY}`;
const LOCALHOST = `http://localhost:8545`;

const DEPLOY_ENV = process.env.DEPLOY_ENV;
const DEPLOY_ENDPOINT = DEPLOY_ENV == "prod" ? SEPOLIA_ENDPOINT : LOCALHOST;

const web3 = new Web3(DEPLOY_ENDPOINT);

const bytecodePath = path.join(__dirname, "../out/ArticuloFactory.bin");
const bytecode = fs.readFileSync(bytecodePath, "utf8");

const abiPath = path.join(__dirname, "../out/ArticuloFactory.json");
const abi = require(abiPath);
const myContract = new web3.eth.Contract(abi);
myContract.handleRevert = true;

const deploy = async () => {
  const acc = web3.eth.accounts.privateKeyToAccount(
    process.env.DEPLOYER_WALLET_PRIVATE_KEY,
  );
  web3.eth.accounts.wallet.add(acc);

  const defaultAccount = acc.address;
  console.log("Deployer account: ", defaultAccount);

  const contractDeployer = myContract.deploy({
    data: `0x${bytecode}`,
  });

  const gas = await contractDeployer.estimateGas({
    from: defaultAccount,
  });
  console.log("Estimated gas: ", gas);

  try {
    const tx = await contractDeployer.send({
      from: defaultAccount,
      gas,
    });
    console.log("Contract deployed at address: ", tx.options.address);

    const deployedAddressPath = path.join(
      __dirname,
      "../out/deployedAddress.json",
    );
    fs.writeFileSync(
      deployedAddressPath,
      JSON.stringify(tx.options.address),
      null,
      "\t",
    );
  } catch (error) {
    console.error("Deployment failed: ", error);
  }
};

deploy();
