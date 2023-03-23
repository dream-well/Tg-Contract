# Hardhat TGERC20

This project deploys the TGERC20 smart contract on the Ethereum blockchain. The contract is upgradeable and has an upgrade script.

## Features

- Deploys a TGERC20 smart contract (implements Openzepplin Votes, Pausable, Upgradeable contracts) on the Ethereum blockchain
- Includes an upgrade script to upgrade the contract
- Includes a liquidity tax (1%) and a marketing tax (3%)
- Has an associated UniswapV2 pair
- Transfer tokens with fees
- Add liquidity to the UniswapV2 pair

## Requirements

- Hardhat
- Solidity 0.8.17
- OpenZeppelin Contracts

## Installation

1. Clone this repository.
2. Install project dependencies using `npm install`.

## Deploy

1. Configure .env file
```
ETH_KEY=<Private key of deployer wallet>
ETHERSCAN_API_KEY=<Etherscan api key for smart contract verification>
```
2. Run `npx hardhat run scripts/deploy.js --network ethereum` to deploy the contract to ethereum. 
   (You can run `npx hardhat run scripts/deploy.js --network goerli` to deploy on goerli testnet.)
3. Verify newly deployed smart contract.
   Run `npx hardhat verify <Smart Contract Address> --network goerli`
## Upgrade

Run `npx hardhat upgrade --address <Smart Contract Address Here> --network ethereum`

## License

This project is licensed under the MIT license.