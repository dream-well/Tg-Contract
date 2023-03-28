//https://unpkg.com/@uniswap/v2-core@1.0.0/build/IUniswapV2Pair.json

const { ethers } = require('hardhat');
const { IUniswapV2Router02, UniswapFactoryAbi, IUniswapV2Pair } = require('../abis');

const uniswapFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

void async function main() {

    [owner, wallet1, teamAddress, marketing_wallet] = await ethers.getSigners()
    
    const factory = await ethers.getContractAt(UniswapFactoryAbi, uniswapFactoryAddress)
    const token = await hre.upgrades.deployProxy(await ethers.getContractFactory("TGERC20"), 
    ["TiGer Token", "TG", uniswapRouterAddress], { initializer: 'init'});
    let tx = await token.deployed();

    // await expect(tx)
    //         .to.emit(factory, "PairCreated")
    
    await token.set_marketing_wallet(marketing_wallet.address);

    let amountIn = ethers.utils.parseUnits("600000000", 18)
    let ethAmount = ethers.utils.parseUnits("10", 18);
    tx = await token.approve(routerAddr, amountIn);
    await tx.wait();
    
    let deadline = parseInt(Date.now() / 1000 + 120);
    tx = await router.addLiquidityETH(tokenAddr, amountIn, amountIn, ethAmount, owner.address, deadline, {value: ethAmount})
    await tx.wait();


    const router02Contract = await ethers.getContractAt(IUniswapV2Router02, uniswapRouterAddress)
    
    // Transfer to wallet1
    tx = await token.transfer(wallet1.address, ethers.utils.parseUnits("10000", 18));
    await tx.wait();
    let balanceOfWallet1 = ethers.utils.formatUnits(await token.balanceOf(wallet1.address));
    let balanceOfMarketingWallet = ethers.utils.formatUnits(await token.balanceOf(marketing_wallet.address));
    
    console.log("Wallet1 balance:", balanceOfWallet1);
    console.log("Marketing Wallet balance:", balanceOfMarketingWallet);

    let uniswapV2PairAddress = await token.uniswapV2Pair();
    let uniswapV2Pair = await ethers.getContractAt(IUniswapV2Pair, uniswapV2PairAddress);

    let totalSupply = await uniswapV2Pair.totalSupply();
    console.log("liquidity supply before token swap:", ethers.utils.formatEther(totalSupply));
    
    deadline = parseInt(Date.now() / 1000 + 120);
    tx = await router02Contract.swapExactTokensForETHSupportingFeeOnTransferTokens(ethers.utils.parseUnits("10000", 18), 0, [token.address, wethAddress], owner.address, deadline);
    await tx.wait();
    
    console.log("liquidity supply after token swap:", ethers.utils.formatEther(totalSupply));
    // tx = token.transfer(wallet1, ethers.utils.parseUnits("10000", 18));
    tx = await token.pause();
    await tx.wait();
    
    
    tx = await token.unpause();
    await tx.wait();
    tx = await token.transfer(wallet1, ethers.utils.parseUnits("10000", 18));
    await tx.wait();

    const governor = await (await ethers.getContractFactory("MyGovernor")).deploy(token.address);
    const grantAmount = ethers.utils.parseUnits("10000", 18);
    const transferCalldata = token.interface.encodeFunctionData('transfer', [teamAddress, grantAmount]);
    await governor.propose([tokenAddress], [0], [transferCalldata], "Proposal #1: Give grant to team");
    const descriptionHash = ethers.utils.id("Proposal #1: Give grant to team");

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
}