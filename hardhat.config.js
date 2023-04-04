require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');

task("upgrade", "Upgrade smart contract")
  .addParam("address", "smart contract address")
  .setAction(async (taskArguments, hre, runSuper) => {
    await hre.upgrades.upgradeProxy(taskArguments.address, (await ethers.getContractFactory("TGERC20")));
    console.log("Successfully upgraded");
});

task("deploy", "Deploy smart contract")
  .addParam("name", "token name")
  .addParam("symbol", "token symbol")
  .addParam("uniswapv2", "uniswapv2 router address")
  .setAction(async (taskArguments, hre, runSuper) => {
    const contract = await hre.upgrades.deployProxy(await ethers.getContractFactory("TGERC20"), 
    [
      taskArguments.name,
      taskArguments.symbol,
      taskArguments.uniswapv2
    ], { initializer: 'init'});
    await contract.deployed();
  
    console.log("Contract deployed to:", contract.address);
});


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1
          }
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.9",
        settings: {
          enabled: true,
          runs: 1
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        id: 1,
        url: "https://mainnet.infura.io/v3/3ea0d2efafbf47ccafbb949db4dc5b45",
      },
      accounts: {mnemonic: process.env.HD_KEY},
      // accounts: [deployerWalletPrivateKey],
      mining: {
        auto: true,
        interval: 20,
      },
      chainId: 1,
    },
    ethereum: {
      url: "https://mainnet.infura.io/v3/3ea0d2efafbf47ccafbb949db4dc5b45",
      chainId: 1,
      accounts: process.env.ETH_KEY !== undefined ? [process.env.ETH_KEY] : [],
      
    },
    goerli: {
      url: "https://goerli.infura.io/v3/3ea0d2efafbf47ccafbb949db4dc5b45",
      chainId: 5,
      accounts: process.env.ETH_KEY !== undefined ? [process.env.ETH_KEY] : [],
      
    },
    bsctestnet: {
      url: "https://rpc.ankr.com/bsc_testnet_chapel",
      chainId: 97,
      accounts: process.env.ETH_KEY !== undefined ? [process.env.ETH_KEY] : [],
      
    },
    bscmainnet: {
      url: "https://bsc-dataseed1.ninicoin.io",
      chainId: 56,
      accounts: process.env.ETH_KEY !== undefined ? [process.env.ETH_KEY] : [],
      
    }
  },
  defaultNetwork: "goerli",
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true
  },
  etherscan: {
    apiKey: {
      bsc: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY
    },
  },
};
