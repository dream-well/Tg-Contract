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
2. To deploy the contract to ethereum:
```sh
npx hardhat deploy --name <Token Name> --symbol <Token Symbol> --uniswapv2 <UniswapV2 Router Address> --network <network>
```
Example input and output:

Input
```sh
npx hardhat deploy --name "Tiger Token" --symbol "TG" --uniswapv2 "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" --network goerli
```

Output
```sh
Contract deployed to: 0x75575C4A8A331e64640BD29123D00d767FA53f5d
```

## Verify

Verify newly deployed smart contract.
```sh
npx hardhat verify <Smart Contract Address> --network <Network>
```

Example Input and output:

Input
```sh
npx hardhat verify 0x75575C4A8A331e64640BD29123D00d767FA53f5d --network goerli
```

Output
```sh
Verifying implementation: 0xE656b92dDc30A4c27Ab799168B954A45Bb439064
Successfully submitted source code for contract
contracts/TGERC20.sol:TGERC20 at 0xE656b92dDc30A4c27Ab799168B954A45Bb439064
for verification on the block explorer. Waiting for verification result...

Successfully verified contract TGERC20 on Etherscan.
https://goerli.etherscan.io/address/0xE656b92dDc30A4c27Ab799168B954A45Bb439064#code
Verifying proxy: 0x75575C4A8A331e64640BD29123D00d767FA53f5d
Contract at 0x75575C4A8A331e64640BD29123D00d767FA53f5d already verified.
Linking proxy 0x75575C4A8A331e64640BD29123D00d767FA53f5d with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0xB0a917d29cf74629e7577e9637dAC27574076f8D
Contract at 0x75575C4A8A331e64640BD29123D00d767FA53f5d already verified.
```

## Interacting with Smart Contract

You can see smart contract code in etherscan.
https://goerli.etherscan.io/address/0x75575C4A8A331e64640BD29123D00d767FA53f5d#code

Also you can interact with smart contract in etherscan.

Read
https://goerli.etherscan.io/address/0x75575C4A8A331e64640BD29123D00d767FA53f5d#readProxyContract

Write
https://goerli.etherscan.io/address/0x75575C4A8A331e64640BD29123D00d767FA53f5d#writeProxyContract

To run admin functions in etherscan, you should follow below steps, 
(Let assume you are using metamask in your browser)
1. In 'Write As Proxy' tab of etherscan page, click 'Connect to Web3' button.
2. "Connect a Wallet" dialog appears and click 'MetaMask'
3. Approve connection with etherscan on MetaMask extension.
4. Once metamask is connected to etherscan, you can run functions listed in this tab.
    - to exclude one wallet from tax, you should run <mark>set_tax_excluded</mark> function.
    ```
    account: 0x7407c8d9bcf40dce967f89f061958b505441d714
    flag: true
    ```
    Fill the params and click 'Write' button.

    Confirm the transaction in metamask and transaction will be processed.

    Once it's done you can confirm account if excluded from tax in 'Read as Proxy' tab.

    Find is_tax_excluded function and input the address into the param field.
    ```
    account: 0x7407c8d9bcf40dce967f89f061958b505441d714
    ```
    Click 'Query' button and it will return the result as boolean.

    - In this way, you can run <mark>set_marketing_wallet</mark> function to change marketing wallet.

    - If you run <mark>transferOwnership</mark>, you can transfer ownership of this smart contract to other wallet address.
    
    When you are owner of smart contract, it means you can run admin functions.

    You can find owner of smart contract by running owner function in 'Read as proxy' tab.

    - You can also run <mark>renounceOwnership</mark> to make the smart contract fully decentralized.

    This function will remove owner so admin function will not run.


## Uniswap V2
To trade tokens in uniswap, you should add liquidity in uniswap first.

You can add liquidity in uniswap site directly.

I will guide you how to do this.

You can add liquidity to Uniswap by first navigating to the Uniswap website and then clicking the “Pool” icon in the top navigation bar. (https://app.uniswap.org/#/pools/v2)

This will take you to the Pool page, where you can create a liquidity pool by connecting your wallet and depositing ETH and your token. 

Click 'Add V2 Liquidity' button and add liquidity with the amount you want to put.

Once the pool is created, you can adjust the ratio of the two tokens to add liquidity.
## Upgrade

```sh
npx hardhat upgrade --address <Smart Contract Address Here> --network <Network>
```

Example Input and output:

Input
```sh
npx hardhat upgrade --address 0x75575C4A8A331e64640BD29123D00d767FA53f5d --network goerli
```

Output
```sh
Successfully upgraded
```

## License

This project is licensed under the MIT license.