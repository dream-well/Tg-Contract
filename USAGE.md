# Environment
Node.js 16.17.1
# Installation

1. Clone this repository using `git clone https://github.com/utilarchy/aicd`
2. Install project dependencies using `npm install`.

# Deployment

1. Configure .env file
```
HD_KEY=<Mnemonic Phrases>
ETHERSCAN_API_KEY=<Etherscan api key for smart contract verification>
```
2. To deploy the contract to ethereum:
```sh
npx hardhat compile
npx hardhat deploy --name <Token Name> --symbol <Token Symbol> --uniswapv2 <UniswapV2 Router Address> --network <network>
```
Example input and output:

Input
```sh
npx hardhat compile
npx hardhat deploy --name "Tiger Token" --symbol "TG" --uniswapv2 "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" --network goerli
```

Output
```sh
Contract deployed to: 0x75575C4A8A331e64640BD29123D00d767FA53f5d
```

# Verify

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

# Interacting with Smart Contract

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


# Uniswap V2
To trade tokens in uniswap, you should add liquidity in uniswap first.

You can add liquidity in uniswap site directly.

I will guide you how to do this.

You can add liquidity to Uniswap by first navigating to the Uniswap website and then clicking the “Pool” icon in the top navigation bar. (https://app.uniswap.org/#/pools/v2)

This will take you to the Pool page, where you can create a liquidity pool by connecting your wallet and depositing ETH and your token. 

Click 'Add V2 Liquidity' button and add liquidity with the amount you want to put.

Once the pool is created, you can adjust the ratio of the two tokens to add liquidity.
# Upgrade

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

# Contract functions

You can test this code snippet in hardhat console.
To run hardhat console
```sh
npx hardhat console --network <Network>
```

These examples are working on goerli testnet so you have to specify network as goerli

```sh
npx hardhat console --network goerli
```

## Readable functions

<h3>Attach Token Contract</h3>
```js
const contract = await ethers.getContractAt("TGERC20", "0x75575C4A8A331e64640BD29123D00d767FA53f5d");
console.log(contract.address);
```
<h3>ERC20 standard functions</h3>

Custom functions

- liquidity_tax
```js
  const liquidity_tax = await contract.liquidity_tax();
  console.log("Liquidity tax:", ethers.utils.formatUnits(liquidity_tax,  0) + "%");
```
```sh
Liquidity tax: 1%
```

- marketing_tax
```js
  const marketing_tax = await contract.marketing_tax();
  console.log("Marketing tax:", ethers.utils.formatUnits(marketing_tax,  0) + "%");
```
```sh
Marketing tax: 1%
```

- marketing_wallet
```js
  const marketing_wallet = await contract.marketing_wallet();
  console.log("Marketing wallet:", marketing_wallet);
```
```sh
Marketing wallet: 0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe
```

- is_tax_excluded
```js
  const is_tax_excluded = await contract.is_tax_excluded("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe");
  console.log("Tax free:", is_tax_excluded);
```
```sh
Tax free: true
```

- uniswapV2Router
```js
  const uniswapV2Router = await contract.uniswapV2Router();
  console.log("uniswapV2Router:", uniswapV2Router);
```
```sh
uniswapV2Router: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
```

ERC20Pausable

- paused
```js
  const paused = await contract.paused();
  console.log("paused:", paused);
```
```sh
paused: false
```

ERC20Votes

- numCheckpoints
```js
  const numCheckpoints = await contract.numCheckpoints("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe");
  console.log("numCheckpoints:", numCheckpoints);
```
```sh
numCheckpoints: 1
```

- checkpoints
```js
  const checkpoints = await contract.checkpoints("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe", 0);
  console.log("checkpoints:", checkpoints);
```
```sh
checkpoints: {fromBlock: 1234, votes: 10}
```

- delegates
```js
  const delegates = await contract.delegates("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe");
  console.log("delegates:", delegates);
```
```sh
delegates: 0x0000000000000000000000000000000000000000
```

- getVotes
```js
  const getVotes = await contract.getVotes("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe");
  console.log("getVotes:", getVotes);
```
```sh
getVotes: 0
```

- getPastVotes
```js
  const getPastVotes = await contract.getPastVotes("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe", 12345);
  console.log("getPastVotes:", getPastVotes);
```
```sh
getPastVotes: 0
```

- getPastTotalSupply
```js
  const getPastTotalSupply = contract.getPastTotalSupply(1234);
  console.log("getPastTotalSupply:", getPastTotalSupply);
```
```sh
getPastTotalSupply: 0
```



## Writable functions

<h3>ERC20</h3>

An ERC20 token contract keeps track of fungible tokens: any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them. This makes ERC20 tokens useful for things like a medium of exchange currency, voting rights, staking, and more.

- name
```js
  const contract = await ethers.getContractAt("TGERC20", "0x75575C4A8A331e64640BD29123D00d767FA53f5d");
  const name = await contract.name();
  console.log("Token name:", name);
```
```sh
Token name: Tiger Token
```

- symbol
```js
  const symbol = await contract.symbol();
  console.log("Token symbol:", symbol);
```
```sh
Token symbol: TG
```

- decimals
```js
  const decimals = await contract.decimals();
  console.log("Token decimals:", decimals);
```
```sh
Token decimals: 18
```

- totalSupply
```js
  const totalSupply = await contract.totalSupply();
  const decimals = await contract.decimals();
  console.log("Token totalSupply:", ethers.utils.formatUnits(totalSupply, decimals));
```
```sh
Token totalSupply: 1000000000.0
```

- balanceOf
```js
  const balance = await contract.balanceOf("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe");
  const decimals = await contract.decimals();
  console.log("Your balance:", ethers.utils.formatUnits(balance, decimals));
```
```sh
Your balance: 1000000000.0
```

- allowance
```js
  const allowance = await contract.allowance("0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984");
  const decimals = await contract.decimals();
  console.log("Your allowance:", ethers.utils.formatUnits(allowance, decimals));
```
```sh
Your allowance: 100000.0
```

- approve
```js
  const owner = await ethers.getSigner();
  const spender = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const amount = ethers.utils.parseUnits("1000", 18);
  await contract.approve(spender, amount) ;
  console.log("allowance:", ethers.utils.formatUnits(await contract.allowance(owner.address, spender), 18));
```

```
allowance: 1000
```

- transfer
```js
  const to = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const amount = ethers.utils.parseUnits("1000", 18);
  await contract.transfer(to, amount);
  console.log("destination balance:", ethers.utils.formatEther(await contract.balanceOf(to)));
```

Output
```
destination balance: 1000
```

- transferFrom
```js
  const from = "0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe";
  const to = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const amount = ethers.utils.parseUnits("1000", 18);
  await contract.transferFrom(from, to, amount);
  console.log("destination balance:", ethers.utils.formatEther(await contract.balanceOf(to)));
```

Output
```
destination balance: 1000
```

- increaseAllowance
```js
  const spender = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const amount = ethers.utils.parseUnits("1000", 18);
  console.log("allowance before:", ethers.utils.formatEther(await contract.allowance(owner.address, spender)));
  await contract.increaseAllowance(spender, amount) ;
  console.log("allowance after:", ethers.utils.formatEther(await contract.allowance(owner.address, spender)));
```

```sh
allowance before: 0.0
allowance after: 1000.0
```
- decreaseAllowance
```js
  const spender = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const amount = ethers.utils.parseUnits("1000", 18);
  console.log("allowance before:", ethers.utils.formatEther(await contract.allowance(owner.address, spender)));
  await contract.decreaseAllowance(spender, amount);
  console.log("allowance after:", ethers.utils.formatEther(await contract.allowance(owner.address, spender)));
```

```sh
allowance before: 1000.0
allowance after: 0.0
```

<h3>Ownable</h3>

- owner

```js
  const owner = await contract.owner();
  console.log("Token owner:", owner);
```

```sh
Token owner: 0xe33FB94588ED193CA42a754992a6Fa2688d3Fcfe
```


<h3>Governor</h3>

 The core logic is given by the Governor contract, but we still need to choose: 1) how voting power is determined, 2) how many votes are needed for quorum, 3) what options people have when casting a vote and how those votes are counted, and 4) what type of token should be used to vote. Each of these aspects is customizable by writing your own module, or more easily choosing one from OpenZeppelin Contracts.

- Create a Proposal

Let’s say we want to create a proposal to give a team a grant, in the form of ERC20 tokens from the governance treasury.

```js
const tokenAddress = ...;
const contract = await ethers.getContractAt("TGERC20", tokenAddress);

const teamAddress = ...;
const grantAmount = ...;
const transferCalldata = token.interface.encodeFunctionData('transfer', [teamAddress, grantAmount]);
await governor.propose(
  [tokenAddress],
  [0],
  [transferCalldata],
  "Proposal #1: Give grant to team",
);
```

- Cast a Vote

Once a proposal is active, delegates can cast their vote. Note that it is delegates who carry voting power: if a token holder wants to participate, they can set a trusted representative as their delegate, or they can become a delegate themselves by self-delegating their voting power.


- Execute the Proposal

Once the voting period is over, if quorum was reached (enough voting power participated) and the majority voted in favor, the proposal is considered successful and can proceed to be executed. Once a proposal passes, it can be queued and executed from the same place you voted.

Executing the proposal will transfer the ERC20 tokens to the chosen recipient. 

```js
const descriptionHash = ethers.utils.id(“Proposal #1: Give grant to team”);

await governor.queue(
  [tokenAddress],
  [0],
  [transferCalldata],
  descriptionHash,
);
await governor.execute(
  [tokenAddress],
  [0],
  [transferCalldata],
  descriptionHash,
);
```

Pausable

Contract module which allows children to implement an emergency stop mechanism that can be triggered by an authorized account.

- paused

Returns true if the contract is paused, and false otherwise.
```js
  console.log("paused:", await contract.paused());
```

- pause
```js
  await contract.pause() ;
  console.log("paused:", await contract.paused());
```

- unpause
```js
  await contract.unpause() ;
  console.log("paused:", await contract.paused());
```

# Run Script
1. Run `npx hardhat run scripts/test.js --network hardhat` to run script on hardhat (ethereum fork). 
(You can run `npx hardhat run scripts/deploy.js --network goerli` to run on goerli testnet. But it consumes much gas fees)

# License

This project is licensed under the MIT license.