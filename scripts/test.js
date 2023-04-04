//https://unpkg.com/@uniswap/v2-core@1.0.0/build/IUniswapV2Pair.json

const { ethers } = require('hardhat');
const { IUniswapV2Router02, UniswapFactoryAbi, IUniswapV2Pair } = require('../abis');
const { promisify } = require('util');
const { makeContractAddress } = require("../helpers/governance");

const timer = promisify(setTimeout);

const uniswapFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

const VoteType = {
    Against: 0,
    For: 1,
    Abstain: 2
};


void async function main() {

    const [owner, wallet1, wallet2, teamwallet, marketing_wallet] = await ethers.getSigners()
    
    const factory = await ethers.getContractAt(UniswapFactoryAbi, uniswapFactoryAddress)
    const token = await hre.upgrades.deployProxy(await ethers.getContractFactory("TGERC20"), 
    ["TiGer Token", "TG", uniswapRouterAddress], { initializer: 'init'});
    let tx = await token.deployed();

    await token.set_marketing_wallet(marketing_wallet.address);
    console.log("Set Marketing Wallet");

    let amountIn = ethers.utils.parseUnits("600000000", 18)
    let ethAmount = ethers.utils.parseUnits("10", 18);
    tx = await token.approve(uniswapRouterAddress, amountIn);
    await tx.wait();
    console.log("Token deployed:", token.address);
    
    const router02Contract = await ethers.getContractAt(IUniswapV2Router02, uniswapRouterAddress)
    let deadline = parseInt(Date.now() / 1000 + 120);
    tx = await router02Contract.addLiquidityETH(token.address, amountIn, amountIn, ethAmount, owner.address, deadline, {value: ethAmount})
    await tx.wait();

    console.log("Liquidity Added");
    
    // Transfer to wallet1
    tx = await token.transfer(wallet1.address, ethers.utils.parseUnits("10000", 18));
    await tx.wait();
    let balanceOfWallet1 = ethers.utils.formatUnits(await token.balanceOf(wallet1.address));
    let balanceOfMarketingWallet = ethers.utils.formatUnits(await token.balanceOf(marketing_wallet.address));
    
    console.log("Wallet1 balance:", balanceOfWallet1);
    console.log("Marketing Wallet balance:", balanceOfMarketingWallet);

    tx = await token.pause();
    await tx.wait();
    console.log("Token Transaction paused:", await token.paused());
    
    tx = await token.unpause();
    await tx.wait();
    console.log("Token Transaction paused:", await token.paused());

    tx = await token.transfer(wallet1.address, ethers.utils.parseUnits("10000", 18));
    await tx.wait();
    console.log("Token transfer 10,000");
    console.log("Wallet1 balance after transfer");


    let uniswapV2PairAddress = await token.uniswapV2Pair();
    let uniswapV2Pair = await ethers.getContractAt(IUniswapV2Pair, uniswapV2PairAddress);

    let totalSupply = await uniswapV2Pair.totalSupply();
    console.log("liquidity supply before token swap:", ethers.utils.formatEther(totalSupply));
    console.log(router02Contract.address);

    tx = await token.approve(router02Contract.address, ethers.utils.parseEther("100"));
    await tx.wait();

    deadline = parseInt(Date.now() / 1000 + 120);
    tx = await router02Contract.swapExactTokensForETHSupportingFeeOnTransferTokens(ethers.utils.parseUnits("100", 18), 0, [token.address, wethAddress], wallet2.address, deadline);
    await tx.wait();

    totalSupply = await uniswapV2Pair.totalSupply();
    console.log("liquidity supply after token swap:", ethers.utils.formatEther(totalSupply));

    const nonce = await ethers.provider.getTransactionCount(owner.address);
    console.log(owner.address, nonce);
    const predictGovernor = await makeContractAddress(owner.address, nonce + 1);

    console.log("predictGovernor", predictGovernor);

    // uint256 minDelay,
    // address[] memory proposers,
    // address[] memory executors
    const minDelay = 0;
    const proposers = [owner.address, predictGovernor];
    const executors = [owner.address, predictGovernor];
    const timerLockController = await (await ethers.getContractFactory("TimelockController")).deploy(minDelay, proposers, executors, owner.address);
    await timerLockController.deployed();
    console.log('timelockcontroller:', timerLockController.address);
    // Deploying Governor Contract
    const governor = await (await ethers.getContractFactory("MyGovernor")).deploy(token.address, timerLockController.address);
    await governor.deployed();
    console.log('governor:', governor.address);    
    
    tx = await token.delegate(owner.address);
    console.log("delegated")    
    console.log(ethers.utils.formatEther(await token.balanceOf(owner.address)));


    // Prepare TransferCallData and GrantAmount
    const grantAmount = ethers.utils.parseUnits("10000", 18);
    const transferCalldata = token.interface.encodeFunctionData('transfer', [teamwallet.address, grantAmount]);
    console.log(transferCalldata);
    console.log(await governor.name());


    tx = await token.transfer(timerLockController.address, ethers.utils.parseUnits("20000", 18));
    await tx.wait();
    console.log("Token transfer 20,000 to Governor");
    console.log("TimelockController balance after transfer", ethers.utils.formatEther(await token.balanceOf(timerLockController.address)));
    
    tx = await governor["propose(address[],uint256[],bytes[],string)"]([token.address], [0], [transferCalldata], "Proposal #1: Give grant to team");

    // Getting Proposal ID from log
    const transaction = await tx.wait();    
    let proposalId = transaction.events[0].args.proposalId
    const descriptionHash = ethers.utils.id("Proposal #1: Give grant to team");
    console.log("proposed", descriptionHash);
    
    await governor.castVote(proposalId, VoteType.For); // VoteType.For
    const votes = await governor.proposals(proposalId);
    // console.log("votes", votes); // < FAILS votes is an array and all its members, "forVotes", "againstVotes", etc are all 0

    let waitBlocks = 10;
    console.log('waiting vote ended');
    while(--waitBlocks > 0) {
        await timer(20);
        console.log('blocknumber:', await ethers.provider.getBlockNumber());
    }
    tx = await governor["queue(uint256)"](proposalId);
    await tx.wait();
    console.log("queued");

    console.log("Teamwallet balance before execution", ethers.utils.formatEther(await token.balanceOf(teamwallet.address)));

    await governor["execute(uint256)"](proposalId);
    console.log("executed");

    // Check balance of teamwallet
    console.log("Teamwallet balance after execution", ethers.utils.formatEther(await token.balanceOf(teamwallet.address)));
    process.exit(0);
}()