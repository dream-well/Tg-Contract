# USAGE

## Installation

1. Clone this repository using `git clone https://github.com/utilarchy/aicd`
2. Install project dependencies using `npm install`.

## Deployment

1. Configure .env file
```
ETH_KEY=<Private key of deployer wallet>
ETHERSCAN_API_KEY=<Etherscan api key for smart contract verification>
```
2. Run `npx hardhat run scripts/deploy.js --network ethereum` to deploy the contract to ethereum. 

    (You can run `npx hardhat run scripts/deploy.js --network goerli` to deploy on goerli testnet.)

## Upgrade

Run `npx hardhat upgrade --address <Smart Contract Address Here> --network ethereum`

## Verify

Verify newly deployed smart contract.
Run `npx hardhat verify <Smart Contract Address> --network goerli`

## License

This project is licensed under the MIT license.